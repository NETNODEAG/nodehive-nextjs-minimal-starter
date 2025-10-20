import Link from 'next/link';
import { Locale } from '@/nodehive/i18n-config';

import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import Navigation from '@/components/layout/Navigation';

type HeaderProps = { lang: Locale };

export default async function Header({ lang }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white shadow-xs">
      <div className="container-wrapper">
        <div className="flex h-[60px] items-center justify-between gap-4 py-2">
          <Link href={`/${lang}`} className="font-bold">
            NodeHive Next.js Minimal Starter
          </Link>

          {/* <Navigation menuId={process.env.NODEHIVE_MAIN_MENU} lang={lang} /> */}

          <LanguageSwitcher lang={lang} />
        </div>
      </div>
    </header>
  );
}
