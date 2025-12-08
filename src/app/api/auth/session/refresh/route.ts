import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthenticationError, NodeHiveClient } from 'nodehive-js';

import { createUserClient } from '@/lib/nodehive-client';

const MAX_RETRIES = 3;
const BACKOFF_MS = 200;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function refreshWithRetries(client: NodeHiveClient) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} to refresh token`);
      await client.auth.refreshToken();
      return;
    } catch (error) {
      console.warn(`Refresh attempt ${attempt} failed`, error);
      if (attempt === MAX_RETRIES) {
        throw error;
      }
      await wait(BACKOFF_MS * 2 ** (attempt - 1));
    }
  }
}

async function handleRefresh(request: NextRequest) {
  const client = createUserClient();
  const refreshToken = await client.auth.getRefreshToken();
  console.log('handle token refresh');
  // Redirect path after refresh
  const nextPath = request.nextUrl.searchParams.get('next');

  const handleFailure = async (
    reason: 'no-refresh-token' | 'auth-error' | 'exception',
    status: number
  ) => {
    try {
      await client.logout();
    } catch (error) {
      console.error('logout failed', error);
    }

    if (nextPath) {
      console.log('session refresh failed, redirecting to', nextPath);
      const redirectUrl = new URL(nextPath, request.url);
      redirectUrl.searchParams.set('session', 'expired');
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.json({ ok: false, reason }, { status });
  };

  if (!refreshToken) {
    return handleFailure('no-refresh-token', 401);
  }

  try {
    await refreshWithRetries(client);

    if (nextPath) {
      console.log('session refreshed, redirecting to', nextPath);
      return NextResponse.redirect(new URL(nextPath, request.url));
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('refresh rejected', error);
      return handleFailure('auth-error', 401);
    }

    console.error('session refresh failed', error);
    return handleFailure('exception', 500);
  }
}

export async function POST(request: NextRequest) {
  return handleRefresh(request);
}

export async function GET(request: NextRequest) {
  return handleRefresh(request);
}

export async function PATCH(request: NextRequest) {
  return handleRefresh(request);
}

export async function DELETE(request: NextRequest) {
  return handleRefresh(request);
}

export async function PUT(request: NextRequest) {
  return handleRefresh(request);
}
