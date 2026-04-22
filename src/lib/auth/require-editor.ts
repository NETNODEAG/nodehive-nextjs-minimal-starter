import { cookies } from 'next/headers';

import { NextCookieStorage } from '@/lib/next-cookie-storage';

/**
 * Guard for route handlers that should only be reachable by an authenticated
 * editor. Checks for the Nodehive refresh-token cookie — that is the durable
 * proof of a logged-in session. The access token alone can be missing (the
 * proxy middleware will refresh it transparently); the refresh token is what
 * proves a login ever happened.
 *
 * Usage:
 *   export async function GET(request, { params }) {
 *     const unauthorized = await requireEditor();
 *     if (unauthorized) return unauthorized;
 *     // ... route logic ...
 *   }
 *
 * Returns a 401 Response when no session cookie is present, otherwise null
 * so the caller can proceed.
 */
export async function requireEditor(): Promise<Response | null> {
  const keys = NextCookieStorage.cookieKeys();
  const refreshToken = (await cookies()).get(keys.refresh_token)?.value;
  if (!refreshToken) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  return null;
}
