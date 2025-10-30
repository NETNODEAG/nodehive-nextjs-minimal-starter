import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthenticationError } from 'nodehive-js';

import { NextCookieStorage } from '@/lib/next-cookie-storage';
import { createUserClient } from '@/lib/nodehive-client';

const REFRESH_THRESHOLD_MS = 30_000;

async function handleRefresh(request: NextRequest) {
  const storage = new NextCookieStorage();
  const expiresRaw = await storage.get('token_expires_at');

  if (!expiresRaw) {
    return NextResponse.json(
      { ok: false, reason: 'no-expiry' },
      { status: 400 }
    );
  }

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt)) {
    return NextResponse.json(
      { ok: false, reason: 'invalid-expiry' },
      { status: 400 }
    );
  }

  const timeLeft = expiresAt - Date.now();
  if (timeLeft > REFRESH_THRESHOLD_MS) {
    return NextResponse.json({ ok: false, reason: 'not-needed' });
  }

  try {
    const client = createUserClient();
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
