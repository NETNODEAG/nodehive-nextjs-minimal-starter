import { createUserClient } from '@/lib/nodehive-client';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export async function AuthWrapper({ children }: AuthWrapperProps) {
  const client = createUserClient();
  const isLoggedIn = await client.isLoggedIn();
  if (isLoggedIn) {
    return children;
  }

  return null;
}

export async function NotLoggedIn({ children }: AuthWrapperProps) {
  const client = createUserClient();
  const isLoggedIn = await client.isLoggedIn();
  if (!isLoggedIn) {
    return children;
  }

  return null;
}
