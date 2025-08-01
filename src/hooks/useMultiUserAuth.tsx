import { useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

const AUTH_STORAGE_KEY = 'pixshare_auth_state';

export const useMultiUserAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    console.log('useMultiUserAuth initialization - stored data:', stored);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('useMultiUserAuth initialization - parsed data:', JSON.stringify(parsed, null, 2));
        const initialState = {
          ...parsed,
          users: parsed.users?.map((user: any) => ({
            ...user,
            createdAt: new Date(user.createdAt)
          })) || []
        };
        console.log('useMultiUserAuth initialization - initial state:', JSON.stringify(initialState, null, 2));
        return initialState;
      } catch (e) {
        console.log('useMultiUserAuth initialization - parse error:', e);
        return { isAuthenticated: false, currentUser: null, users: [] };
      }
    }
    console.log('useMultiUserAuth initialization - no stored data');
    return { isAuthenticated: false, currentUser: null, users: [] };
  });

  console.log('useMultiUserAuth current state:', JSON.stringify(authState, null, 2));

  // Save to localStorage whenever state changes
  useEffect(() => {
    console.log('useMultiUserAuth - saving to localStorage:', authState);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  // Force re-read from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated && !authState.isAuthenticated) {
          console.log('useMultiUserAuth - force updating from localStorage:', parsed);
          setAuthState({
            ...parsed,
            users: parsed.users?.map((user: any) => ({
              ...user,
              createdAt: new Date(user.createdAt)
            })) || []
          });
        }
      } catch (e) {
        console.log('useMultiUserAuth - force update error:', e);
      }
    }
  }, []);

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => {
    console.log('addUser called with:', userData);
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isActive: true
    };

    console.log('Creating new user:', newUser);

    setAuthState(prev => {
      const newState = {
        ...prev,
        users: [...prev.users.map(u => ({ ...u, isActive: false })), newUser],
        currentUser: newUser,
        isAuthenticated: true
      };
      console.log('New auth state:', newState);
      return newState;
    });

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
    }
  };

  const logout = () => {
    setAuthState(prev => ({
      ...prev,
      currentUser: null,
      isAuthenticated: false,
      users: prev.users.map(u => ({ ...u, isActive: false }))
    }));
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

  return {
    ...authState,
    addUser,
    switchUser,
    logout,
    deleteUser,
    getCurrentUserImages,
    hasMultipleUsers: authState.users.length > 1
  };
};