import Link from 'next/link';
import { createServerClient } from '@/nodehive/client';
import Debug from '@/nodehive/components/helpers/debug';
import { Locale } from '@/nodehive/i18n-config';

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
