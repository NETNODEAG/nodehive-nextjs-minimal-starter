'use client';

import React, { useEffect, useState } from 'react';
import { getUserAction, saveAuthTokenAction } from '@/actions/_auth';
import { AuthContext } from '@/nodehive/context/auth-context';
import { NodeHiveUser } from '@/nodehive/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NodeHiveUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    setIsLoading(true);
    const user = await getUserAction();
    setUser(user);
    setIsLoading(false);
  };

  const loginWithToken = async (token: string) => {
    try {
      setIsLoading(true);
      await saveAuthTokenAction(token);
      const user = await getUserAction();
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const isInIframe = window.self !== window.top;

    if (!isInIframe) {
      return;
    }

    const handlePostMessage = (event: MessageEvent) => {
      const isValidOrigin =
        event.origin === process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;

      if (!isValidOrigin) {
        console.warn(
          'Received postMessage from untrusted origin:',
          event.origin
        );
        return;
      }
      if (
        event.data &&
        event.data.type === 'nodehive-login' &&
        event.data.token &&
        typeof event.data.token === 'string' &&
        event.data.token.length > 0
      ) {
        loginWithToken(event.data.token);
      }
    };

    window.addEventListener('message', handlePostMessage);
    // Notify the parent window that the auth provider is ready
    window.parent.postMessage(
      { type: 'auth-ready' },
      process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
    );

    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  const value = { user, isLoggedIn: !!user, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
