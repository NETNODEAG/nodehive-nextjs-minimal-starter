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

// API paths skip locale rewrite/redirect, but still need token refresh so
// editors don't see 401s mid-session.
function isApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/') || /^\/[a-z]{2}\/api\//.test(pathname);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isApi = isApiPath(pathname);

  if (i18n.isMultilingual && !isApi) {
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

  // { request } forwards cookie mutations from refresh to server components.
  const response =
    i18n.isMultilingual || isApi
      ? NextResponse.next({ request })
      : NextResponse.rewrite(
          new URL(
            `/${i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
            request.url
          ),
          { request }
        );

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
      // API clients expect a status, not a redirect.
      if (isApi) {
        const unauthorized = new NextResponse('Unauthorized', { status: 401 });
        clearAuthCookies(request, unauthorized);
        return unauthorized;
      }
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

// Matcher covers /api/ and /{lang}/api/ so token refresh keeps editor
// sessions fresh. Safe against the old OAuth refresh race thanks to
// per-token dedupe in src/lib/auth/refresh.ts (activeRefreshes).
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon*.png|manifest.ts|manifest.webmanifest|robots.ts|robots.txt|css/|metadata/|images/).*)',
  ],
};
