'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types/user';
import {
  getCurrentUser,
  login as authLogin,
  logout as authLogout,
  signup as authSignup,
  restoreSession,
  isAuthenticated,
} from '@/lib/user/auth';
import type { AuthCredentials, SignupData, AuthResult } from '@/lib/user/auth';

// ============================================================================
// CONTEXT TYPE
// ============================================================================

interface UserContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;

  // Actions
  login: (credentials: AuthCredentials) => Promise<AuthResult>;
  signup: (data: SignupData) => Promise<AuthResult>;
  logout: () => void;
  refreshUser: () => void;
}

// ============================================================================
// CREATE CONTEXT
// ============================================================================

const UserContext = createContext<UserContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoredUser = restoreSession();
    setUser(restoredUser);
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (credentials: AuthCredentials): Promise<AuthResult> => {
    const result = await authLogin(credentials);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  // Signup function
  const signup = async (data: SignupData): Promise<AuthResult> => {
    const result = await authSignup(data);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  // Logout function
  const logout = () => {
    authLogout();
    setUser(null);
  };

  // Refresh user data
  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  const value: UserContextType = {
    user,
    isLoading,
    isLoggedIn: user !== null,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// ============================================================================
// PROTECTED ROUTE HOC
// ============================================================================

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">Please log in to continue</h1>
            <a
              href="/auth/login"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
            >
              Go to Login
            </a>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
