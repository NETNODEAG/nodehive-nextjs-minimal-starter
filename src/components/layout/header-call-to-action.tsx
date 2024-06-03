import { createServerClient } from '@/nodehive/client';

import Fragment from '@/components/fragment/Fragment';

export default async function HeaderCallToAction() {
  const client = createServerClient();

  const fragment = await client.getFragment(
    'c797de39-f9bb-4191-9db4-f61bbd6a1a5a',
    'cta'
  );

  return <Fragment fragment={fragment?.data} />;
}
