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

  // Current path without the locale prefix, e.g. "/about" when on "/en/about".
  const resourcePath =
    pathname.replace(new RegExp(`^/${lang}(?=/|$)`), '') || '/';

  useEffect(() => {
    async function fetchTranslatedPaths() {
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
  }, [lang, resourcePath]);

  return (
    <ul className="flex gap-2">
      {i18n.locales.map((locale) => {
        // Use whatever Drupal returns (alias or canonical /node/<id>).
        // Drupal handles the fallback to source language on its side;
        // we just pass through whatever it gives us, or use the current
        // resource path if nothing is returned for this locale.
        const href = translatedPaths?.[locale]
          ? `/${locale}${translatedPaths[locale]}`
          : `/${locale}${resourcePath === '/' ? '' : resourcePath}`;

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
