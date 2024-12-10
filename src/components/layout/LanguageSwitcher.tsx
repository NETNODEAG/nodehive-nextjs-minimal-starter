import { headers } from 'next/headers';
import Link from 'next/link';
import { i18n, Locale } from '@/nodehive/i18n-config';

import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  lang: Locale;
};

export default async function LanguageSwitcher({
  lang,
}: LanguageSwitcherProps) {
  const headersList = await headers();

  const pathname = headersList.get('x-pathname') || '';

  return (
    <ul className="flex gap-2">
      {i18n.locales.map((locale) => (
        <li key={locale}>
          <Link
            href={lang === locale ? pathname : pathname.replace(lang, locale)}
            locale={locale}
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
      ))}
    </ul>
  );
}
