import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/nodehive/i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const getLocale = (request: NextRequest) => {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
};

// Paths that are handled by the Next.js app, not Drupal
const NON_ENTITY_PATHS = [
  'static',
  '_next',
  'sitemap',
  'sitemap.xml',
  'forbidden',
  'not-found',
  'api',
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow requests for static files to pass through
  if (
    pathname.startsWith('/css/') ||
    pathname.startsWith('/metadata/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icon') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /news
    // The new URL is now /de/news
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }

  const pathWithoutLocale = i18n.locales.reduce(
    (path, locale) => path.replace(`/${locale}`, ''),
    pathname
  );

  // Check if the pathWithoutLocale matches any of the NON_ENTITY_PATHS
  const isNonEntityPath = NON_ENTITY_PATHS.some(
    (path) =>
      pathWithoutLocale.startsWith(`/${path}/`) ||
      pathWithoutLocale === `/${path}`
  );

  if (isNonEntityPath) {
    return NextResponse.next();
  }

  // If no other conditions are met, proceed to the dynamic route [[...slug]]
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico|icon*.png|manifest.ts|robots.ts|robots.txt).*)',
  ],
};
