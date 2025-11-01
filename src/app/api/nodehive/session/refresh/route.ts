import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthenticationError } from 'nodehive-js';

import { createUserClient } from '@/lib/nodehive-client';

async function handleRefresh(request: NextRequest) {
  const client = createUserClient();
  const refreshToken = await client.auth.getRefreshToken();
  console.log('Handle refresh, Refresh token:', refreshToken);

  if (!refreshToken) {
    return NextResponse.json(
      { ok: false, reason: 'no-refresh-token' },
      { status: 400 }
    );
  }

  try {
    await client.auth.refreshToken();

    // Check if we should redirect back to the original page
    const nextPath = request.nextUrl.searchParams.get('next');
    if (nextPath) {
      console.log('NodeHive: session refreshed, redirecting to', nextPath);
      return NextResponse.redirect(new URL(nextPath, request.url));
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('NodeHive: refresh rejected', error);
      return NextResponse.json(
        { ok: false, reason: 'auth-error' },
        { status: 401 }
      );
    }

    console.error('NodeHive: session refresh failed', error);
    return NextResponse.json(
      { ok: false, reason: 'exception' },
      { status: 500 }
    );
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
