import { redirect } from 'next/navigation';

import { i18n } from '@/config/i18n-config';
import { getUser } from '@/lib/auth';
import LoginForm from '@/components/auth/login-form';

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

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
