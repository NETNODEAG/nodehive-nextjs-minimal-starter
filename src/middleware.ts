import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/nodehive/i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const getLocale = (request: NextRequest) => {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
};

// Create a middleware that will detect the default language of the user
// and redirect to the correct path
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Create a new Headers object from the request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  requestHeaders.set('x-pathname', pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Check if the request is for a resource in the public/css directory
  if (pathname.startsWith('/css/')) {
    return response; // No redirection for resources in the public directory
  }

  // Check if the request is for a resource in the public/metadata directory
  if (pathname.startsWith('/metadata/')) {
    return response; // No redirection for resources in the public directory
  }

  // Ignore it for icons and favicon and manifest
  if (
    pathname.startsWith('/icon') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/robots.txt'
  ) {
    return response;
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

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico|icon*.png|manifest.ts|robots.ts|robots.txt).*)',
  ],
};
