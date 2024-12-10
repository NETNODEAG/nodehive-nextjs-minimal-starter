import { cookies } from 'next/headers';
import { cookieUserToken } from '@/nodehive/client';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export async function AuthWrapper({ children }: AuthWrapperProps) {
  const cookieStore = await cookies();

  const userToken = cookieStore.has(cookieUserToken);

  if (userToken) return children;
}

export async function NotLoggedIn({ children }: AuthWrapperProps) {
  const cookieStore = await cookies();

  const userToken = cookieStore.has(cookieUserToken);

  if (!userToken) return children;
}
