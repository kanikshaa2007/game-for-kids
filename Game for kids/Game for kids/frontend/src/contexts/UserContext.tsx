'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { login as loginApi, getUserProfile } from '@/lib/api';
import { storage } from '@/lib/utils';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, age: number) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const userId = storage.get<string | null>('userId', null);

    if (userId) {
      loadUser(userId);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function loadUser(userId: string) {
    try {
      const userData = await getUserProfile(userId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      storage.remove('userId');
    } finally {
      setIsLoading(false);
    }
  }

  async function login(username: string, age: number) {
    try {
      const userData = await loginApi(username, age);
      setUser(userData);
      
      // Extract userId - ensure it's a valid string
      const userId = userData._id ? String(userData._id) : String(userData.userId);
      
      // Validate userId is not empty
      if (!userId || userId.trim() === '') {
        throw new Error('Invalid user ID received from server');
      }
      
      // Store userId as plain string without extra quotes
      storage.set('userId', userId.trim());
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  function logout() {
    setUser(null);
    storage.remove('userId');
  }

  async function refreshUser() {
    if (user) {
      try {
        const userData = await getUserProfile(user._id);
        setUser(userData);
      } catch (error) {
        console.error('Failed to refresh user:', error);
      }
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}

