import { Suspense } from 'react';
import { AuthProvider } from '@/providers/auth-provider';

import { createUserClient } from '@/lib/nodehive-client';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = createUserClient();
  const isLoggedInPromise = client.auth.isLoggedIn();
  return (
    <Suspense>
      <AuthProvider isLoggedInPromise={isLoggedInPromise}>
        {children}
      </AuthProvider>
    </Suspense>
  );
}
