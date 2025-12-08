import { Suspense } from 'react';
import Link from 'next/link';

import { i18n, Locale } from '@/config/i18n-config';
import Container from '@/components/theme/atoms-layout/container/container';
import LanguageSwitcher from '@/components/theme/global-layout/language-switcher/language-switcher';
import Navigation from '@/components/theme/global-layout/navigation/navigation';

type HeaderProps = { lang: string };

export default async function Header({ lang: langProp }: HeaderProps) {
  const lang = langProp as Locale;
  const mainMenuId = process.env.NODEHIVE_MAIN_MENU;
  const isMultilingual = i18n.isMultilingual;
  return (
    <header className="sticky top-0 z-20 bg-white shadow-xs">
      <Container className="max-w-360">
        <div className="flex h-[60px] items-center justify-between gap-4 py-2">
          <Link href={`/${isMultilingual ? lang : ''}`} className="font-bold">
            NodeHive Next.js Starter
          </Link>
          {mainMenuId && (
            <Suspense>
              <Navigation menuId={mainMenuId} lang={lang} />
            </Suspense>
          )}
          {isMultilingual && <LanguageSwitcher lang={lang} />}
        </div>
      </Container>
    </header>
  );
}
