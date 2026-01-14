import 'server-only';

import { i18n, Locale } from '@/config/i18n-config';

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  de: () => import('./de.json').then((module) => module.default),
};

export async function getDictionary(locale: Locale) {
  const loadDictionary =
    dictionaries[locale as keyof typeof dictionaries] ||
    dictionaries[i18n.defaultLocale as keyof typeof dictionaries] ||
    dictionaries.en;

  return loadDictionary();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
