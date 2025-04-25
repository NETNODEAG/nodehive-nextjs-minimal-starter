import { createServerClient } from '@/nodehive/client';

import Fragment from '@/components/fragment/Fragment';

export default async function Footer() {
  const client = await createServerClient();

  // INFO: Add the id of the fragment that you want to fetch
  // You can uncomment the line below or remove it. It's just an example
  // const fragment = await client.getFragment(
  //   '899fcc1d-1555-4641-8b52-e99fbf9009e6',
  //   'text'
  // );

  return (
    <footer>
      <div className="container-wrapper py-4">
        {/* <Fragment fragment={fragment?.data} /> */}
      </div>
    </footer>
  );
}
