import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { apiService } from '@/data/services/apiService';

const AUTH_STORAGE_KEY = 'pixshare_auth_state';

interface AuthContextType extends AuthState {
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => User;
  switchUser: (userId: string) => void;
  logout: () => void;
  deleteUser: (userId: string) => void;
  getCurrentUserImages: () => any[];
  hasMultipleUsers: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
    users: []
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userid = parseInt(sessionStorage.getItem('userid') || '0');
        const users = await apiService.getUserForUser(userid);
        const initialState = {
          isAuthenticated: users.length > 0,
          currentUser: users.length > 0 ? users[0] : null,
          users: users
        };
        console.log(users)

        console.log('AuthProvider initialization - initial state:', JSON.stringify(initialState, null, 2));
        setAuthState(initialState);
      } catch (e) {
        console.error('AuthProvider initialization - parse error:', e);
        setAuthState({ isAuthenticated: false, currentUser: null, users: [] });
      }
    };

    initializeAuth();
  }, []);


  // Save to localStorage whenever state changes
  useEffect(() => {
    authState.isAuthenticated = true
    try {
      const dataToSave = JSON.stringify(authState);
      // localStorage.setItem(AUTH_STORAGE_KEY, dataToSave);

      // Dispatch event for any listening components
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: authState }));
    } catch (error) {
      console.error('AuthProvider - ERROR saving to localStorage:', error);
    }
  }, [authState]);

  // Force re-read from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated && !authState.isAuthenticated) {
          console.log('AuthProvider - force updating from localStorage:', parsed);
          setAuthState({
            ...parsed,
            users: parsed.users?.map((user: any) => ({
              ...user,
              createdAt: new Date(user.createdAt)
            })) || []
          });
        }
      } catch (e) {
        console.log('AuthProvider - force update error:', e);
      }
    }
  }, []);

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => {
    console.log('AuthProvider addUser called with:', userData);
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isActive: true
    };

    console.log('AuthProvider Creating new user:', newUser);

    const newState = {
      isAuthenticated: true,
      currentUser: newUser,
      users: [...authState.users.map(u => ({ ...u, isActive: false })), newUser]
    };
        
    setAuthState(newState);

    return newUser;
  };

  const switchUser = (userId: string) => {
    console.log('AuthContext switchUser called with userId:', userId);
    const user = authState.users.find(u => u.id === userId);
    console.log('Found user:', user);
    if (user) {
      console.log('Switching to user:', user.id, user.name);
      
      // Update sessionStorage with the new user's ID
            sessionStorage.setItem('userid', user.id.toString());

      // sessionStorage.setItem('userid', user.id);
      console.log('Updated sessionStorage userid to:', user.id);
      
      setAuthState(prev => ({
        ...prev,
        users: prev.users.map(u => ({ ...u, isActive: u.id === userId })),
        currentUser: user,
        isAuthenticated: true
      }));
    } else {
      console.log('User not found with id:', userId);
    }
  };

  const logout = () => {
    console.log('AuthProvider logout called - clearing all data');
    console.log('AuthProvider Current authState before logout:', JSON.stringify(authState, null, 2));
    
    const clearedState = {
      isAuthenticated: false,
      currentUser: null,
      users: []
    };
    
    console.log('AuthProvider Setting cleared state:', clearedState);
    setAuthState(clearedState);
    
    // Also clear localStorage directly as backup
    setTimeout(() => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      console.log('AuthProvider localStorage cleared directly');
    }, 100);
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = authState.users.filter(u => u.id !== userId);
    const wasCurrentUser = authState.currentUser?.id === userId;
    
    setAuthState(prev => ({
      ...prev,
      users: updatedUsers,
      currentUser: wasCurrentUser ? null : prev.currentUser,
      isAuthenticated: wasCurrentUser ? false : prev.isAuthenticated
    }));
  };

  const getCurrentUserImages = () => {
    // This would be implemented to filter images by current user
    // For now, return empty array
    return [];
  };

  const value: AuthContextType = {
    ...authState,
    addUser,
    switchUser,
    logout,
    deleteUser,
    getCurrentUserImages,
    hasMultipleUsers: authState.users.length > 1
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useMultiUserAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useMultiUserAuth must be used within an AuthProvider');
  }
  return context;
};