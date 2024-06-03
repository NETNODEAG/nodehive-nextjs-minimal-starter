import { cookies } from 'next/headers';
import { cookieUserToken } from '@/nodehive/client';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const cookieStore = cookies();

  const userToken = cookieStore.has(cookieUserToken);

  if (userToken) return children;
}

export function NotLoggedIn({ children }: AuthWrapperProps) {
  const cookieStore = cookies();

  const userToken = cookieStore.has(cookieUserToken);

  if (!userToken) return children;
}
