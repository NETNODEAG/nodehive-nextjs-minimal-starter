import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { createServerClient } from '@/nodehive/client';

export const nodehiveAuthToken = `${process.env.NEXT_PUBLIC_NODEHIVE_SPACE_NAME}_auth-token`;

const fetchUserCached = cache(async (authToken: string) => {
  const client = await createServerClient();
  const user = await client.fetchUserDetails(authToken);
  // Check if user is empty object
  if (!user || (typeof user === 'object' && Object.keys(user).length === 0)) {
    return null;
  }
  return user;
});

/**
 * Get the current user
 * @returns {Promise<User | null>} The user object or null if not authenticated
 */
export const getUser = async () => {
  const authToken = await getAuthToken();

  if (!authToken) return null;

  try {
    return await fetchUserCached(authToken);
  } catch {
    return null;
  }
};

/**
 * Get the current auth token from cookies
 * @returns {Promise<string | null>} The auth token or null if not found
 */
export const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(nodehiveAuthToken)?.value || null;
};

/**
 * Save auth token to cookies
 * @param {string} token - The auth token
 */
export const saveAuthToken = async (token: string) => {
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

/**
 * Clear auth token from cookies
 */
export const clearAuthToken = async () => {
  const cookieStore = await cookies();

  if (cookieStore.has(nodehiveAuthToken)) {
    cookieStore.delete(nodehiveAuthToken);
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated
 */
export const isAuthenticated = async () => {
  const user = await getUser();
  return !!user;
};
