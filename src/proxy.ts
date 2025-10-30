import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

import { i18n } from '@/config/i18n-config';

const REFRESH_THRESHOLD_MS = 30_000;
const spacePrefix = process.env.NEXT_PUBLIC_NODEHIVE_SPACE_NAME || 'nodehive';
const EXPIRES_COOKIE = `${spacePrefix}_expires`;

const NON_ENTITY_PATHS = [
  'static',
  '_next',
  'sitemap',
  'sitemap.xml',
  'forbidden',
  'not-found',
  'api',
];

const getLocale = (request: NextRequest) => {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  return matchLocale(languages, locales, i18n.defaultLocale);
};

const shouldRefreshSession = (request: NextRequest): boolean => {
  const expiresRaw = request.cookies.get(EXPIRES_COOKIE)?.value;
  if (!expiresRaw) {
    return false;
  }

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt)) {
    return false;
  }

  const timeLeft = expiresAt - Date.now();
  return timeLeft <= REFRESH_THRESHOLD_MS;
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Don't check refresh on the refresh endpoint itself
  if (!pathname.startsWith('/api/nodehive/session/refresh')) {
    // Check if session needs refresh
    if (shouldRefreshSession(request)) {
      console.log('NodeHive: redirecting to refresh session');

      // Build refresh URL with return path
      const refreshUrl = new URL('/api/nodehive/session/refresh', request.url);
      refreshUrl.searchParams.set('next', pathname + request.nextUrl.search);

      return NextResponse.redirect(refreshUrl);
    }
  }

  if (!i18n.isMultilingual) {
    const rewriteUrl = new URL(
      `/${i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
      request.url
    );
    return NextResponse.rewrite(rewriteUrl);
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
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

  const isNonEntityPath = NON_ENTITY_PATHS.some(
    (path) =>
      pathWithoutLocale.startsWith(`/${path}/`) ||
      pathWithoutLocale === `/${path}`
  );

  if (isNonEntityPath) {
    return NextResponse.next();
  }

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
    '/((?!api|[a-z]{2}/api|_next/static|_next/image|favicon.ico|icon*.png|manifest.ts|robots.ts|robots.txt|css/|metadata/|images/).*)',
  ],
};
