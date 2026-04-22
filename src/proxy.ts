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

// API paths are language-neutral (or already prefixed under /{lang}/api/).
// Language-rewrite/redirect logic should skip them — but token refresh
// should still run so editors do not see random 401s mid-session when their
// access token expires between navigations.
function isApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/') || /^\/[a-z]{2}\/api\//.test(pathname);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isApi = isApiPath(pathname);

  // i18n missing-locale redirect — only for user-facing pages, never API.
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

  // Pass { request } so request.cookies mutations during refresh are
  // forwarded to server components via x-middleware-request-* headers.
  // API paths always pass through — no rewrite to the default locale.
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
      // API clients expect a status code / JSON, not a 3xx redirect.
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

// Matcher includes /api/ and /{lang}/api/ — token-refresh runs on API requests
// too, so editor sessions stay fresh mid-workflow. Historical note: these
// paths were previously excluded to dodge an OAuth refresh race (commit
// ba94af7). That race was structurally eliminated by moving the refresh
// inline (commit 6f687b7) and deduping concurrent refreshes per-token in
// src/lib/auth/refresh.ts (activeRefreshes Map). It is now safe — and better
// for UX — to let the middleware see API requests.
export const config = {
  matcher: [
    // excludes static assets, favicon, manifest, robots, images, etc.
    '/((?!_next/static|_next/image|favicon.ico|icon*.png|manifest.ts|manifest.webmanifest|robots.ts|robots.txt|css/|metadata/|images/).*)',
  ],
};
