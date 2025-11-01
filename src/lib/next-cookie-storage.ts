import { cookies } from 'next/headers';
import { CookieOptions, StorageAdapter } from 'nodehive-js';

type CookieKey = 'token' | 'refresh_token' | 'userDetails' | 'token_expires_at';

type CookieKeyMap = Record<CookieKey, string>;

export class NextCookieStorage implements StorageAdapter {
  static cookieKeys(): CookieKeyMap {
    const spacePrefix =
      process.env.NEXT_PUBLIC_NODEHIVE_SPACE_NAME || 'nodehive';
    return {
      token: `${spacePrefix}_token`,
      refresh_token: `${spacePrefix}_refresh_token`,
      userDetails: `${spacePrefix}_userDetails`,
      token_expires_at: `${spacePrefix}_token_expires_at`,
    };
  }

  private resolveKey(key: string): string | null {
    return NextCookieStorage.cookieKeys()[key as CookieKey] ?? null;
  }

  async get(key: string): Promise<string | null> {
    const cookieStore = await cookies();
    const name = this.resolveKey(key);
    if (!name) return null;
    return cookieStore.get(name)?.value || null;
  }

  async set(
    key: string,
    value: string,
    options?: CookieOptions
  ): Promise<void> {
    const cookieStore = await cookies();
    const name = this.resolveKey(key);
    if (!name) return;
    cookieStore.set({
      name,
      value,
      maxAge: options?.maxAge,
      httpOnly: options?.httpOnly ?? true,
      sameSite:
        (options?.sameSite?.toLowerCase() as 'lax' | 'strict' | 'none') ??
        'lax',
      secure: options?.secure ?? process.env.NODE_ENV === 'production',
      path: options?.path ?? '/',
    });
  }

  async remove(key: string): Promise<void> {
    const cookieStore = await cookies();
    const name = this.resolveKey(key);
    if (!name) return;
    if (cookieStore.has(name)) {
      cookieStore.delete(name);
    }
  }
}
