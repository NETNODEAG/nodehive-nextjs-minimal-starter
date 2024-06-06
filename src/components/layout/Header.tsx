import Link from 'next/link';

import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import Navigation from '@/components/layout/Navigation';

export default async function Header({ lang }) {
  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="container-wrapper">
        <div className="flex h-[60px] items-center justify-between gap-4 py-2">
          <Link href="/" className="font-bold">
            NodeHive Minimal Starter
          </Link>

          {/* INFO: Add the id of the menu you want to display in the Navigation component below. */}
          <Navigation menuId="main" />

          <LanguageSwitcher lang={lang} />
        </div>
      </div>
    </header>
  );
}
