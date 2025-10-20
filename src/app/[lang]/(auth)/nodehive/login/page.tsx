import { redirect } from 'next/navigation';
import { getUser } from '@/nodehive/auth';

import LoginForm from '@/components/auth/LoginForm';

export default async function Page() {
  const user = await getUser();

  if (user) {
    redirect('/nodehive/account');
  }

  return (
    <section className="space-y-8">
      <h1>Login</h1>

      <LoginForm />
    </section>
  );
}
