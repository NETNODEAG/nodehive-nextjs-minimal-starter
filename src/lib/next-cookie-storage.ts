import { cookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';
import { CookieOptions, StorageAdapter } from 'nodehive-js';

type CookieKey =
  | 'token'
  | 'refresh_token'
  | 'user_details'
  | 'token_expires_at';

type CookieKeyMap = Record<CookieKey, string>;

export interface ProxyContext {
  request: NextRequest;
  response: NextResponse;
}

export const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export class NextCookieStorage implements StorageAdapter {
  private request?: NextRequest;
  private response?: NextResponse;

  constructor(proxyContext?: ProxyContext) {
    this.request = proxyContext?.request;
    this.response = proxyContext?.response;
  }

  static cookieKeys(): CookieKeyMap {
    const spacePrefix =
      process.env.NEXT_PUBLIC_NODEHIVE_SPACE_NAME || 'nodehive';
    return {
      token: `${spacePrefix}_token`,
      refresh_token: `${spacePrefix}_refresh_token`,
      user_details: `${spacePrefix}_user_details`,
      token_expires_at: `${spacePrefix}_token_expires_at`,
    };
  }

  private resolveKey(key: string): string | null {
    return NextCookieStorage.cookieKeys()[key as CookieKey] ?? null;
  }

  async get(key: string): Promise<string | null> {
    const name = this.resolveKey(key);
    if (!name) return null;

    if (this.request) {
      return this.request.cookies.get(name)?.value || null;
    }

    const cookieStore = await cookies();
    return cookieStore.get(name)?.value || null;
  }

  async set(
    key: string,
    value: string,
    options?: CookieOptions
  ): Promise<void> {
    const name = this.resolveKey(key);
    if (!name) return;

    if (this.request && this.response) {
      // Proxy context: set on request (for server components) and response (for browser)
      this.request.cookies.set(name, value);
      this.response.cookies.set(name, value, {
        ...BASE_COOKIE_OPTIONS,
        maxAge: options?.maxAge,
      });
      return;
    }

    // Server component / server action context
    const cookieStore = await cookies();
    cookieStore.set({
      name,
      value,
      maxAge: options?.maxAge,
      httpOnly: options?.httpOnly ?? BASE_COOKIE_OPTIONS.httpOnly,
      sameSite:
        (options?.sameSite?.toLowerCase() as 'lax' | 'strict' | 'none') ??
        BASE_COOKIE_OPTIONS.sameSite,
      secure: options?.secure ?? BASE_COOKIE_OPTIONS.secure,
      path: options?.path ?? BASE_COOKIE_OPTIONS.path,
    });
  }

  async remove(key: string): Promise<void> {
    const name = this.resolveKey(key);
    if (!name) return;

    if (this.request && this.response) {
      // Proxy context: delete from both request and response
      this.request.cookies.delete(name);
      this.response.cookies.delete(name);
      return;
    }

    // Server component / server action context
    const cookieStore = await cookies();
    if (cookieStore.has(name)) {
      cookieStore.delete(name);
    }
  }
}
