import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/nodehive/auth';

export async function PATCH(request: NextRequest) {
  const { path, type, data, nodeId, fieldName, lang } = await request.json();

  const jsonApiType = type.replace('node--', '');

  const userToken = await getAuthToken();

  if (!userToken) {
    return NextResponse.json(
      { status: 'error', message: 'User is not authenticated' },
      { status: 401 }
    );
  }
  try {
    const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL;

    const apiUrl = `${DRUPAL_BASE_URL}/${lang}/jsonapi/node/${jsonApiType}/${nodeId}`;

    const payload = {
      data: {
        type: type,
        id: nodeId,
        attributes: {
          [fieldName]: JSON.stringify(data),
        },
      },
    };

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to update Drupal node: ${response.status} ${JSON.stringify(errorData)}`
      );
    }

    console.log(`Successfully updated node ${nodeId} with Puck data`);
  } catch (error) {
    console.error('Error updating Drupal node:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }

  revalidatePath(path);
  return NextResponse.json({ status: 'ok' });
}
