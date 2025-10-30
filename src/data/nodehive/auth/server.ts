'use server';

import { redirect } from 'next/navigation';

import { clearAuthToken, getUser, saveAuthToken } from '@/lib/auth';
import { createUserClient } from '@/lib/nodehive-client';

/**
 * The login state
 */
export type LoginState = {
  message?: { title: string; text: string; type: string };
};

/**
 * Login
 * @param {LoginState} prevState - The previous state
 * @param {FormData} formData - The form data
 *
 * @returns {Promise}
 */
export async function login(
  prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const client = createUserClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { success } = await client.login(email, password);

    if (!success) {
      return {
        message: {
          title: 'Login Failed',
          text: 'Invalid credentials. Please try again.',
          type: 'error',
        },
      };
    }
  } catch (e) {
    console.error(e);

    return {
      message: {
        title: 'Login Failed',
        text: 'Database error. Please try again later.',
        type: 'error',
      },
    };
  }
  redirect('/nodehive/account');
}

/**
 * Logout
 *
 * @returns {Promise}
 */
export async function logout() {
  const client = createUserClient();
  await client.logout();
  redirect('/nodehive/login');
}

/**
 * Server action to get the current user
 * @returns {Promise<User | null>} The user object or null if not authenticated
 */
export const getUserAction = async () => {
  return await getUser();
};

/**
 * Server action to save auth token
 * @param {string} token - The auth token
 */
export async function saveAuthTokenAction(token: string) {
  return await saveAuthToken(token);
}

/**
 * Server action to clear auth token from cookies
 */
export async function clearAuthTokenAction() {
  return await clearAuthToken();
}
