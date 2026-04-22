import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

import { i18n } from '@/config/i18n-config';
import {
  clearAuthCookies,
  isAuthFailure,
  refreshSession,
  shouldRefreshSession,
} from '@/lib/auth/refresh';

const getLocale = (request: NextRequest) => {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  return matchLocale(languages, locales, i18n.defaultLocale);
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // i18n missing-locale → redirect (terminates; no cookie forwarding needed).
  if (i18n.isMultilingual) {
    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
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
  }

  // Pass { request } so request.cookies mutations during refresh are
  // forwarded to server components via x-middleware-request-* headers.
  const response = i18n.isMultilingual
    ? NextResponse.next({ request })
    : NextResponse.rewrite(
        new URL(
          `/${i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
          request.url
        ),
        { request }
      );

  // Skip token refresh for prefetch requests
  if (request.headers.get('next-router-prefetch') === '1') {
    return response;
  }

  if (!shouldRefreshSession(request)) {
    return response;
  }

  try {
    await refreshSession(request, response);
    return response;
  } catch (error) {
    if (isAuthFailure(error)) {
      console.warn('[Proxy] Refresh token invalid, clearing session');
      const expiredUrl = new URL(request.url);
      expiredUrl.searchParams.set('session', 'expired');
      const redirectResponse = NextResponse.redirect(expiredUrl);
      clearAuthCookies(request, redirectResponse);
      return redirectResponse;
    }

    console.warn(
      '[Proxy] Token refresh failed (transient), keeping session:',
      error
    );
    return response;
  }
}

export const config = {
  matcher: [
    // excludes routes api, [lang]/api, static assets, favicon, manifest, robots, etc.
    '/((?!api|[a-z]{2}/api|_next/static|_next/image|favicon.ico|icon*.png|manifest.ts|manifest.webmanifest|robots.ts|robots.txt|css/|metadata/|images/).*)',
  ],
};
