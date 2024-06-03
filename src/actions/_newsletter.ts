'use server';

/**
 * The subscribe state
 */
export type SubscribeState = {
  errors?: {
    email?: string[];
  };
  message?: {
    title: string;
    text: string;
    type: string;
  };
};

/**
 * Subscribe
 * @param {SubscribeState} prevState - The previous state
 * @param {FormData} formData - The form data
 *
 * @returns {Promise}
 */
export async function subscribe(prevState: SubscribeState, formData: FormData) {
  const email = formData.get('email') as string;

  const webformData = JSON.stringify({
    webform_id: 'newsletter',
    e_mail: email,
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL}/webform_rest/submit`,
      {
        method: 'POST',
        body: webformData,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      return {
        message: {
          title: 'Signup Failed',
          text: response.statusText,
          type: 'error',
        },
      };
    } else {
      return {
        message: {
          title: 'Signup Successful',
          text: 'Thank you for signing up!',
          type: 'success',
        },
      };
    }
  } catch (e) {
    console.error(e);

    return {
      message: {
        title: 'Signup Failed',
        text: 'Database error. Please try again later.',
        type: 'error',
      },
    };
  }
}
