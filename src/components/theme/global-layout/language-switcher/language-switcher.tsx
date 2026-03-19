'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { i18n, Locale } from '@/config/i18n-config';
import { cn } from '@/lib/utils';

type TranslatedPaths = { [key in Locale]?: string };

type LanguageSwitcherProps = {
  lang: Locale;
};

export default function LanguageSwitcher({ lang }: LanguageSwitcherProps) {
  const [translatedPaths, setTranslatedPaths] = useState<
    TranslatedPaths | undefined
  >();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchTranslatedPaths() {
      // Strip the locale prefix to get the resource path
      const resourcePath =
        pathname.replace(new RegExp(`^/${lang}(?=/|$)`), '') || '/';

      // No need to fetch translations for the homepage
      if (resourcePath === '/') {
        setTranslatedPaths(undefined);
        return;
      }

      try {
        const response = await fetch(
          `/api/translated-paths?path=${encodeURIComponent(resourcePath)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const paths = await response.json();
        setTranslatedPaths(paths);
      } catch (error) {
        console.error('Failed to fetch translated paths:', error);
        setTranslatedPaths(undefined);
      }
    }

    fetchTranslatedPaths();
  }, [lang, pathname]);

  return (
    <ul className="flex gap-2">
      {i18n.locales.map((locale) => {
        const href = translatedPaths?.[locale]
          ? `/${locale}${translatedPaths[locale]}`
          : `/${locale}`;

        return (
          <li key={locale}>
            <Link
              href={href}
              className={cn(
                lang === locale
                  ? 'underline underline-offset-2'
                  : 'text-black/60',
                'text-base font-bold uppercase'
              )}
            >
              {locale}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
