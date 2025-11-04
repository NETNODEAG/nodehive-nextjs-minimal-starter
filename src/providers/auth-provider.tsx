'use client';

import React, { useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/context/auth-context';

export interface AuthProviderProps extends AuthContextType {
  children: React.ReactNode;
}

export function AuthProvider({
  children,
  isLoggedIn,
  user,
  expiresAt,
}: AuthProviderProps) {
  // TODO Fix the automated login
  const loginWithToken = async (token: string) => {
    // try {
    //   setIsLoading(true);
    //   TODO Fix the automated login
    //   await saveAuthTokenAction(token);
    //   const user = await getUserAction();
    //   setUser(user);
    // } catch (error) {
    //   console.error('Login failed:', error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  useEffect(() => {
    const isInIframe =
      typeof window !== 'undefined' && window.self !== window.top;

    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;

    if (!baseUrl) {
      console.error('NEXT_PUBLIC_DRUPAL_BASE_URL is not defined');
      return;
    }

    if (!isInIframe) {
      return;
    }

    const handlePostMessage = (event: MessageEvent) => {
      const isValidOrigin = event.origin === baseUrl;

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
    window.parent.postMessage({ type: 'auth-ready' }, baseUrl);

    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  const ctx = {
    user: user,
    isLoggedIn: isLoggedIn,
    expiresAt: expiresAt,
  };

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}
