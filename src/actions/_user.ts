'use server';

import { cookies } from 'next/headers';
import {
  cookieUser,
  cookieUserToken,
  createServerClient,
} from '@/nodehive/client';

/**
 * Get user
 *
 * @returns {Promise}
 */
export async function getUser() {
  const cookieStore = await cookies();
  const client = await createServerClient();

  const hasUserToken = cookieStore.has(cookieUserToken);

  if (!hasUserToken) {
    return { user: null };
  }

  const userToken = cookieStore.get(cookieUserToken)?.value;

  const userData = await client.fetchUserDetails(userToken);

  return { user: userData };
}

/**
 * Save user details
 *
 * @param {Object} user - The user object
 *
 * @returns {Promise}
 */
export async function saveUserDetails(user) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: cookieUser,
    value: JSON.stringify(user),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
  });
}

/**
 * Read user details
 *
 * @returns {Promise}
 */
export async function readUserDetails() {
  const cookieStore = await cookies();

  const hasUser = cookieStore.has(cookieUser);
  const user = cookieStore.get(cookieUser)?.value;

  if (!hasUser) {
    return null;
  }

  return JSON.parse(user);
}
