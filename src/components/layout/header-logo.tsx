import { createServerClient } from '@/nodehive/client';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import Fragment from '@/components/fragment/Fragment';

export default async function HeaderLogo() {
  const client = createServerClient();

  const apiParams = new DrupalJsonApiParams();
  const queryString = apiParams.addInclude(['field_logo']);

  const fragment = await client.getFragment(
    '79261be4-ca1a-4959-878f-b07fe4ed3e18',
    'space_logo',
    'en',
    queryString
  );

  return <Fragment fragment={fragment?.data} />;
}
