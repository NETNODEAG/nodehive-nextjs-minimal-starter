import { isAuthenticated } from '@/nodehive/auth';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export async function AuthWrapper({ children }: AuthWrapperProps) {
  if (await isAuthenticated()) {
    return children;
  }

  return null;
}

export async function NotLoggedIn({ children }: AuthWrapperProps) {
  if (!(await isAuthenticated())) {
    return children;
  }

  return null;
}
