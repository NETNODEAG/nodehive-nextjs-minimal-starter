const locales = ['en', 'de'] as const;

const defaultLocale = process.env
  .NEXT_PUBLIC_NODEHIVE_DEFAULT_LANGUAGE as Locale;

export const i18n = {
  defaultLocale: defaultLocale,
  locales,
  isMultilingual: locales.length > 1,
} satisfies {
  locales: readonly Locale[];
  defaultLocale: Locale;
  isMultilingual: boolean;
};

export type Locale = (typeof locales)[number];
