'use server';

import { refresh } from 'next/cache';

import { createUserClient } from '@/lib/nodehive-client';

/**
 * The login state
 */
export type LoginState = {
  message?: { title: string; text: string; type: string };
};

export async function login(
  prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const client = createUserClient();
    const { success } = await client.login(email, password);

    if (!success) {
      throw new Error('Invalid credentials');
    }

    refresh();
    return {
      message: {
        title: 'Login Successful',
        text: 'You are now logged in.',
        type: 'success',
      },
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Database error. Please try again later.';
    return {
      message: {
        title: 'Login Failed',
        text: message,
        type: 'error',
      },
    };
  }
}

export async function logout(): Promise<void> {
  const client = createUserClient();
  await client.logout();
  refresh();
}
