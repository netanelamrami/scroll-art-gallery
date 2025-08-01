import { useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

const AUTH_STORAGE_KEY = 'pixshare_auth_state';

export const useMultiUserAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          users: parsed.users?.map((user: any) => ({
            ...user,
            createdAt: new Date(user.createdAt)
          })) || []
        };
      } catch {
        return { isAuthenticated: false, currentUser: null, users: [] };
      }
    }
    return { isAuthenticated: false, currentUser: null, users: [] };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isActive: true
    };

    setAuthState(prev => ({
      ...prev,
      users: [...prev.users.map(u => ({ ...u, isActive: false })), newUser],
      currentUser: newUser,
      isAuthenticated: true
    }));

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