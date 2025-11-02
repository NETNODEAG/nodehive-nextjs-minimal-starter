import { Suspense } from 'react';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';

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
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
    </Suspense>
  );
}
