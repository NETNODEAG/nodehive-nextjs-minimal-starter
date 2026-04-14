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

function handleI18nRouting(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

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

  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  // Skip token refresh for prefetch requests
  if (request.headers.get('next-router-prefetch') === '1') {
    return handleI18nRouting(request);
  }

  if (!shouldRefreshSession(request)) {
    return handleI18nRouting(request);
  }

  try {
    // Refresh first — creates NextResponse.next({ request }) internally,
    // updates request.cookies and collects Set-Cookie headers.
    const refreshResponse = await refreshSession(request);

    // Create the routing response (request cookies are already updated)
    const response = handleI18nRouting(request);

    // Copy Set-Cookie headers from refresh response to routing response
    for (const header of refreshResponse.headers.getSetCookie()) {
      response.headers.append('Set-Cookie', header);
    }

    return response;
  } catch (error) {
    if (isAuthFailure(error)) {
      console.warn('[Proxy] Refresh token invalid, clearing session');
      const expiredUrl = new URL(request.url);
      expiredUrl.searchParams.set('session', 'expired');
      const response = NextResponse.redirect(expiredUrl);
      clearAuthCookies(request, response);
      return response;
    }

    console.warn(
      '[Proxy] Token refresh failed (transient), keeping session:',
      error
    );
    return handleI18nRouting(request);
  }
}

export const config = {
  matcher: [
    // excludes routes api, [lang]/api, static assets, favicon, manifest, robots, etc.
    '/((?!api|[a-z]{2}/api|_next/static|_next/image|favicon.ico|icon*.png|manifest.ts|manifest.webmanifest|robots.ts|robots.txt|css/|metadata/|images/).*)',
  ],
};
