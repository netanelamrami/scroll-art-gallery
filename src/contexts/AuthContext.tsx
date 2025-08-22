import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { apiService } from '@/data/services/apiService';

const AUTH_STORAGE_KEY = 'pixshare_auth_state';

interface AuthContextType extends AuthState {
  addUser: (userData: Omit<User, 'createdAt' | 'isActive'>) => User;
  switchUser: (userId: string) => void;
  logout: () => void;
  deleteUser: (userId: string) => void;
  getCurrentUserImages: () => any[];
  hasMultipleUsers: boolean;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setSendNotification: (userId: string, value: boolean, content: string, isEmailMode: boolean) => void;
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
  const [firstLogin, setfirstLogin] =useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        
        const userid = parseInt(sessionStorage.getItem('userid'))
        if(!userid) {
          return;
        }
        const users = await apiService.getUserForUser(userid);
        
        const initialState = {
          isAuthenticated: users.length > 0,
          currentUser: users.length > 0 ? users[0] : null,
          users: users
        };
        setAuthState(initialState);
        console.log('AuthProvider - New user added:', authState);
      } catch (e) {
        setAuthState({ isAuthenticated: false, currentUser: null, users: [] });
      }
    };

    initializeAuth();
  }, [firstLogin]);


  // Save to localStorage whenever state changes
  // useEffect(() => {
  //   authState.isAuthenticated = true
  //   try {
  //     // const dataToSave = JSON.stringify(authState);
  //     // localStorage.setItem(AUTH_STORAGE_KEY, dataToSave);

  //     // Dispatch event for any listening components
  //     //window.dispatchEvent(new CustomEvent('authStateChanged', { detail: authState }));
  //         console.log( authState);

  //   } catch (error) {
  //     console.error('AuthProvider - ERROR saving to localStorage:', error);
  //   }
  // }, [authState]);

  // Force re-read from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated && !authState.isAuthenticated) {
          setAuthState({
            ...parsed,
            users: parsed.users?.map((user: any) => ({
              ...user,
              createdAt: new Date(user.createdAt)
            })) || []
          });
        }
      } 
     catch (error) {
      console.error('AuthProvider - ERROR parsing localStorage data:', error);    
    }
  }
  }, []);

  const addUser = (userData: Omit<User,  'createdAt' | 'isActive'>) => {
    const newUser: User = {
      ...userData,
      createdAt: new Date(),
      isActive: true
    };

    const newState = {
      isAuthenticated: true,
      currentUser: newUser,
      users: [...authState.users.map(u => ({ ...u, isActive: false })), newUser]
    };
    
    setAuthState(newState);
    console.log('AuthProvider - New user added:', newState);
    setfirstLogin(true);
    
    return newUser;
  };

  const switchUser = (userId: string) => {
    const user = authState.users.find(u => u.id === userId);
    if (user) {      
      setAuthState(prev => ({
        ...prev,
        users: prev.users.map(u => ({ ...u, isActive: u.id === userId })),
        currentUser: user,
        isAuthenticated: true
      }));
        const event = new CustomEvent('switchToMyPhotos', { detail: user });
        window.dispatchEvent(event);
    } 
  };

  const logout = () => {
    const clearedState = {
      isAuthenticated: false,
      currentUser: null,
      users: []
    };
    
    setAuthState(clearedState);
    
    // Also clear localStorage directly as backup
    setTimeout(() => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem('userid');
      sessionStorage.removeItem('userFullName');
      sessionStorage.removeItem('isRegister');
      sessionStorage.removeItem('jwtUser');
      sessionStorage.removeItem('photourl');
   
      window.location.reload();
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

const setSendNotification = async (userId, value, content, isEmailMode) => {
  setAuthState(prev => ({
    ...prev,
    users: prev.users.map(u =>
      u.id === userId ? { ...u, sendNotification: value } : u
    ),
    currentUser:
      prev.currentUser && prev.currentUser.id === userId
        ? { ...prev.currentUser, sendNotification: value }
        : prev.currentUser,
  }));

    const { user } = await apiService.loginUser(userId) as { user: User };
    if (value) {
      if (isEmailMode) {
        user.email = content;
      } else {
        user.phoneNumber = content;
        // user.countryCode = content.slice(0, 3);
      }
    }

    user.sendNotification = value;
    await apiService.updateUser(user);
  };

  const getCurrentUserImages = () => {
    // This would be implemented to filter images by current user
    // For now, return empty array
    return [];
  };

  const setUsers = (users: React.SetStateAction<User[]>) => {
    setAuthState(prev => ({
      ...prev,
      users: typeof users === 'function' ? users(prev.users) : users
    }));
  };

  const value: AuthContextType = {
    ...authState,
    addUser,
    switchUser,
    logout,
    deleteUser,
    getCurrentUserImages,
    hasMultipleUsers: authState.users.length > 1,
    setUsers,
    setSendNotification
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