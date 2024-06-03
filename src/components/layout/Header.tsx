import Link from 'next/link';

import LanguageSwitcher from './LanguageSwitcher';

export default async function Header({ lang }) {
  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="container-wrapper">
        <div className="flex h-[60px] items-center justify-between gap-4 py-2">
          <Link
            href="/"
            className="bg-primary rounded-lg px-4 py-1 text-base text-white"
          >
            Logo
          </Link>

          <LanguageSwitcher lang={lang} />
        </div>
      </div>
    </header>
  );
}
