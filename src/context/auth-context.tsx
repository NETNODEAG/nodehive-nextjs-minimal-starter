'use client';

import { createContext, useContext } from 'react';

import { NodeHiveUser } from '@/types/nodehive';

export interface AuthContextType {
  user: NodeHiveUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
