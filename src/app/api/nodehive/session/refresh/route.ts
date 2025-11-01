import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthenticationError } from 'nodehive-js';

import { createUserClient } from '@/lib/nodehive-client';

async function handleRefresh(request: NextRequest) {
  const client = createUserClient();
  const refreshToken = await client.auth.getRefreshToken();
  // Redirect path after refresh
  const nextPath = request.nextUrl.searchParams.get('next');
  console.log('Handle refresh', refreshToken);

  const preferHTML = (): boolean => {
    const accept = request.headers.get('accept');
    if (!accept) return true;
    return accept.includes('text/html');
  };

  const handleFailure = async (
    reason: 'no-refresh-token' | 'auth-error' | 'exception',
    status: number
  ) => {
    try {
      await client.logout();
    } catch (error) {
      console.error('Nodehive: failed to logout', error);
    }

    if (preferHTML()) {
      const loginUrl = new URL('/nodehive/login', request.url);
      if (nextPath) {
        loginUrl.searchParams.set('next', nextPath);
      }
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.json({ ok: false, reason }, { status });
  };

  if (!refreshToken) {
    return handleFailure('no-refresh-token', 401);
  }

  try {
    await client.auth.refreshToken();

    if (nextPath) {
      console.log('NodeHive: session refreshed, redirecting to', nextPath);
      return NextResponse.redirect(new URL(nextPath, request.url));
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('NodeHive: refresh rejected', error);
      return handleFailure('auth-error', 401);
    }

    console.error('NodeHive: session refresh failed', error);
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
