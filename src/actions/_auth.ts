'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  cookieUser,
  cookieUserToken,
  createServerClient,
} from '@/nodehive/client';

import { getUser, saveUserDetails } from './_user';

/**
 * The login state
 */
export type LoginState = {
  message?: {
    title: string;
    text: string;
    type: string;
  };
};

/**
 * Login
 * @param {LoginState} prevState - The previous state
 * @param {FormData} formData - The form data
 *
 * @returns {Promise}
 */
export async function login(prevState: LoginState, formData: FormData) {
  const cookieStore = cookies();
  const client = createServerClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { data: token, error: tokenError } = await client.getJWTAccessToken(
      email,
      password
    );

    if (tokenError && tokenError !== undefined) {
      return {
        message: {
          title: 'Login Failed',
          text: tokenError,
          type: 'error',
        },
      };
    } else {
      cookieStore.set({
        name: cookieUserToken,
        value: token,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      });

      if (token) {
        const { user } = await getUser();

        await saveUserDetails(user);
      }
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
}

/**
 * Logout
 *
 * @returns {Promise}
 */
export async function logout() {
  const cookieStore = cookies();

  const hasUserToken = cookieStore.has(cookieUserToken);
  const hasUser = cookieStore.has(cookieUser);

  if (hasUserToken) cookieStore.delete(cookieUserToken);
  if (hasUser) cookieStore.delete(cookieUser);

  redirect('/nodehive/login');
}
