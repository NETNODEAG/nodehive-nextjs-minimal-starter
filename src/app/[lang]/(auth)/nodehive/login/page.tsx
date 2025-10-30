import { redirect } from 'next/navigation';
import { getUser } from '@/data/nodehive/user/get-user';

import { i18n } from '@/config/i18n-config';
import LoginForm from '@/components/auth/login-form';
import { H1 } from '@/components/theme/atoms-content/heading/heading';
import Container from '@/components/theme/atoms-layout/container/container';

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default async function Page() {
  const user = await getUser();

  if (user) {
    redirect('/nodehive/account');
  }

  return (
    <Container width={'narrow'} className="py-8">
      <div className="space-y-8">
        <H1>Login</H1>
        <LoginForm />
      </div>
    </Container>
  );
}
