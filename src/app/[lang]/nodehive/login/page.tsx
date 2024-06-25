import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cookieUserToken } from '@/nodehive/client';
import LoginForm from '@/nodehive/components/auth/LoginForm';

export default function Page() {
  const cookieStore = cookies();
  const hasUserToken = cookieStore.has(cookieUserToken);

  if (hasUserToken) {
    redirect('/nodehive/account');
  }

  return (
    <section className="space-y-8">
      <h1>Login</h1>

      <LoginForm />
    </section>
  );
}
