import Link from 'next/link';
import { Dictionary } from '@/dictionaries';

import { Locale } from '@/config/i18n-config';

type NotTranslatedProps = {
  sourceLang: Locale;
  sourceHref: string;
  dictionary: Dictionary;
};

export default function NotTranslated({
  sourceLang,
  sourceHref,
  dictionary,
}: NotTranslatedProps) {
  const strings = dictionary.notTranslated;

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
        {strings.title}
      </h1>
      <p className="mt-4 text-base text-gray-600">{strings.body}</p>
      <Link
        href={sourceHref}
        hrefLang={sourceLang}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
      >
        {strings.readOriginal}
        <span className="text-xs tracking-wide uppercase opacity-60">
          {sourceLang}
        </span>
      </Link>
    </div>
  );
}
