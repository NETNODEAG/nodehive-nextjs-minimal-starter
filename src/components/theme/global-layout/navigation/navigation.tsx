import Link from 'next/link';

import { Locale } from '@/config/i18n-config';
import { createServerClient } from '@/lib/nodehive-client';
import Debug from '@/components/ui/atoms/debug/debug';

interface NavigationProps {
  menuId: string;
  lang: Locale;
}

type NavigationItem = {
  id: string;
  title: string;
  url: string;
};

export default async function Navigation({ menuId, lang }: NavigationProps) {
  const client = await createServerClient();

  const navigation = await client.getMenuTree(menuId, { lang });

  <Debug data={navigation} />;
  if (!navigation?.data?.length) {
    return <>No menu for menu {menuId}</>;
  }

  return (
    <nav className="hidden md:block">
      <ul className="flex gap-8">
        {navigation?.data?.map((item: NavigationItem) => (
          <li key={item.id}>
            <Link href={item.url} className="font-semibold">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
