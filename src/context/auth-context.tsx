'use client';

import { createContext, useContext } from 'react';

import { NodeHiveUser } from '@/types/nodehive';

export interface AuthContextType {
  user: Promise<NodeHiveUser | null>;
  isLoggedIn: Promise<boolean>;
  expiresAt: Promise<number | null>;
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
