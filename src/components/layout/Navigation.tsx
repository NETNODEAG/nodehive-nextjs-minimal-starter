import Link from 'next/link';
import { createServerClient } from '@/nodehive/client';
import { Locale } from '@/nodehive/i18n-config';

interface NavigationProps {
  menuId: string;
  lang: Locale;
}

export default async function Navigation({ menuId, lang }: NavigationProps) {
  const client = await createServerClient();

  const navigation = await client.getMenuItems(menuId, lang);

  if (!navigation?.data?.length) {
    return null;
  }

  return (
    <nav className="hidden md:block">
      <ul className="flex gap-8">
        {navigation?.data?.map((item) => (
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
