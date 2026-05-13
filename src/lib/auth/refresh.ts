import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthenticationError, type LoginResult } from 'nodehive-js';

import {
  BASE_COOKIE_OPTIONS,
  NextCookieStorage,
} from '@/lib/next-cookie-storage';
import { createUserClient } from '@/lib/nodehive-client';

const MAX_RETRIES = 3;
const BACKOFF_MS = 200;
const ROTATION_GRACE_MS = 30_000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Per-user dedup: prevents concurrent requests from racing on token rotation.
// Note: This Map is per-isolate — on serverless deployments, dedup is best-effort
// and not guaranteed across concurrent isolates. On long-running servers it works fully.
const activeRefreshes = new Map<string, Promise<LoginResult>>();

// Grace cache for recently rotated refresh tokens.
//
// OAuth refresh tokens are single-use: each successful refresh invalidates the
// previous one. But the browser can have parallel requests in flight carrying
// the old refresh-token cookie when the rotation happens. Without this cache,
// stale requests arriving just AFTER the original refresh completed (so the
// `activeRefreshes` dedup map is already empty) trigger a second refresh that
// fails with invalid_grant and logs the user out.
//
// Mapping: old refresh_token → fresh LoginResult, valid for ROTATION_GRACE_MS.
const recentRotations = new Map<
  string,
  { result: LoginResult; expiresAt: number }
>();

function rememberRotation(oldToken: string, result: LoginResult) {
  const expiresAt = Date.now() + ROTATION_GRACE_MS;
  recentRotations.set(oldToken, { result, expiresAt });
  setTimeout(() => recentRotations.delete(oldToken), ROTATION_GRACE_MS).unref?.();
}

function getRecentRotation(oldToken: string): LoginResult | null {
  const entry = recentRotations.get(oldToken);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    recentRotations.delete(oldToken);
    return null;
  }
  console.info('[Refresh] grace cache hit — stale refresh-token reused');
  return entry.result;
}

/**
 * Check if the session token needs refreshing.
 * Returns true if a refresh token exists and the access token is missing or expires within 60s.
 */
export function shouldRefreshSession(request: NextRequest): boolean {
  const keys = NextCookieStorage.cookieKeys();
  const token = request.cookies.get(keys.token)?.value;
  const refreshToken = request.cookies.get(keys.refresh_token)?.value;
  const expiresAt = request.cookies.get(keys.token_expires_at)?.value;

  // Need a refresh token to do anything
  if (!refreshToken) return false;

  const expiresAtNumber = expiresAt ? Number(expiresAt) : null;
  const tokenExpiresSoon =
    typeof expiresAtNumber === 'number' &&
    Number.isFinite(expiresAtNumber) &&
    expiresAtNumber <= Date.now() + 60_000;

  // Refresh if we have no token or it's about to expire
  return !token || tokenExpiresSoon;
}

/**
 * Refresh the OAuth session inline (Supabase pattern).
 * Mutates request.cookies (for server components in the current request)
 * and sets Set-Cookie on the given response (for the browser).
 * The caller must have created `response` with `{ request }` so the cookie
 * mutations are forwarded via x-middleware-request-* headers.
 * Throws on failure — caller decides how to handle.
 */
export async function refreshSession(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  const keys = NextCookieStorage.cookieKeys();
  const refreshToken = request.cookies.get(keys.refresh_token)?.value;

  if (!refreshToken) {
    throw new AuthenticationError('No refresh token available');
  }

  // Dedup: if another request is already refreshing with the same token, reuse it
  await refreshOnce(refreshToken, { request, response });
}

/**
 * Clear all auth cookies from both request and response.
 */
export function clearAuthCookies(
  request: NextRequest,
  response: NextResponse
): void {
  const keys = NextCookieStorage.cookieKeys();
  for (const name of Object.values(keys)) {
    request.cookies.delete(name);
    response.cookies.set(name, '', {
      ...BASE_COOKIE_OPTIONS,
      maxAge: 0,
    });
  }
}

/**
 * Check if an error represents an auth failure (invalid/expired refresh token)
 * vs a transient error (network, timeout, server error).
 */
export function isAuthFailure(error: unknown): boolean {
  if (!(error instanceof AuthenticationError)) return false;
  const status = error.details?.status;
  return status === 400 || status === 401 || status === 403;
}

function refreshOnce(
  refreshToken: string,
  context: { request: NextRequest; response: NextResponse }
): Promise<LoginResult> {
  const recent = getRecentRotation(refreshToken);
  if (recent) return Promise.resolve(recent);

  const existing = activeRefreshes.get(refreshToken);
  if (existing) return existing;

  const client = createUserClient(context);

  const promise = refreshWithRetries(client)
    .then((result) => {
      rememberRotation(refreshToken, result);
      return result;
    })
    .finally(() => {
      activeRefreshes.delete(refreshToken);
    });

  activeRefreshes.set(refreshToken, promise);
  return promise;
}

async function refreshWithRetries(
  client: ReturnType<typeof createUserClient>
): Promise<LoginResult> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await client.auth.refreshToken();
    } catch (error) {
      lastError = error;

      // Don't retry auth failures (invalid/expired refresh token)
      if (isAuthFailure(error)) {
        throw error;
      }

      if (attempt < MAX_RETRIES) {
        console.warn(`[Refresh] Attempt ${attempt} failed, retrying...`, error);
        await wait(BACKOFF_MS * 2 ** (attempt - 1));
      }
    }
  }

  throw lastError;
}
