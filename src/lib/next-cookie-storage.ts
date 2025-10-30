import { cookies } from 'next/headers';
import { StorageAdapter } from 'nodehive-js';

export class NextCookieStorage implements StorageAdapter {
  private readonly spacePrefix =
    process.env.NEXT_PUBLIC_NODEHIVE_SPACE_NAME || 'nodehive';

  KEY_MAP: Record<string, string> = {
    token: this.spacePrefix + '_access',
    refresh_token: this.spacePrefix + '_refresh',
    userDetails: this.spacePrefix + '_userDetails',
    token_expires_at: `${this.spacePrefix}_expires`,
  };

  private resolveKey(key: string): string | null {
    return this.KEY_MAP[key] ?? null;
  }

  async get(key: string): Promise<string | null> {
    const cookieStore = await cookies();
    const name = this.resolveKey(key);
    if (!name) return null;
    return cookieStore.get(name)?.value || null;
  }

  async set(key: string, value: string): Promise<void> {
    const cookieStore = await cookies();
    const name = this.resolveKey(key);
    if (!name) return;
    cookieStore.set({
      name,
      value,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
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
