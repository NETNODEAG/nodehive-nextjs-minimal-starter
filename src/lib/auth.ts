import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';

import { NodeHiveUser } from '@/types/nodehive';
import { createServerClient } from '@/lib/nodehive-client';

export const nodehiveAuthToken = `${process.env.NEXT_PUBLIC_NODEHIVE_SPACE_NAME}_auth-token`;

const fetchUserCached = cache(
  async (authToken: string): Promise<NodeHiveUser | null> => {
    const client = await createServerClient();
    const user = await client.fetchUserDetails(authToken);
    // Check if user is empty object
    if (!user || (typeof user === 'object' && Object.keys(user).length === 0)) {
      return null;
    }
    return user as unknown as NodeHiveUser;
  }
);

export const getUser = async (): Promise<NodeHiveUser | null> => {
  const authToken = await getAuthToken();

  if (!authToken) return null;

  try {
    return await fetchUserCached(authToken);
  } catch {
    return null;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(nodehiveAuthToken)?.value || null;
};

export const saveAuthToken = async (token: string): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: nodehiveAuthToken,
    value: token,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
  });
};

export const clearAuthToken = async (): Promise<void> => {
  const cookieStore = await cookies();

  if (cookieStore.has(nodehiveAuthToken)) {
    cookieStore.delete(nodehiveAuthToken);
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getUser();
  return !!user;
};
