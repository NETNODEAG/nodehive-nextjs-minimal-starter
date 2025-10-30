import { AuthProvider } from '@/providers/auth-provider';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
