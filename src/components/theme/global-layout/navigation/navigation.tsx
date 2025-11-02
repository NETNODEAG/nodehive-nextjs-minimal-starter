import Link from 'next/link';
import { getMainMenu } from '@/data/nodehive/menu/get-main-menu';

import { Locale } from '@/config/i18n-config';

interface NavigationProps {
  menuId: string;
  lang: Locale;
}

export default async function Navigation({ menuId, lang }: NavigationProps) {
  const navigation = await getMainMenu(menuId, lang);

  if (!navigation?.length) {
    return <>No menu for id: {menuId}</>;
  }

  return (
    <nav className="hidden md:block">
      <ul className="flex gap-8">
        {navigation?.map((item) => (
          <li key={item.id} className="group relative">
            <Link href={item.url} className="font-semibold hover:underline">
              {item.title}
            </Link>
            {item.children && item.children.length > 0 && (
              <ul className="absolute z-10 hidden space-y-2 bg-white px-2 py-2 shadow-md group-hover:block">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={child.url}
                      className="font-semibold whitespace-nowrap hover:underline"
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
