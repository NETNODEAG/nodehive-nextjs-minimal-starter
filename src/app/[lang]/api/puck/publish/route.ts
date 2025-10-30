import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { i18n } from '@/config/i18n-config';
import { getAuthToken } from '@/lib/auth';
import { createUserClient } from '@/lib/nodehive-client';

export async function PATCH(request: NextRequest) {
  const { path, type, data, nodeId, fieldName, lang } = await request.json();
  console.log('Publishing Puck data for node', nodeId, 'field', fieldName);

  const jsonApiType = type.replace('node--', '');

  // const userToken = await getAuthToken();

  // if (!userToken) {
  //   return NextResponse.json(
  //     { status: 'error', message: 'User is not authenticated' },
  //     { status: 401 }
  //   );
  // }
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL;

    const isMultilingual = i18n.isMultilingual;
    let endpoint = `/jsonapi/node/${jsonApiType}/${nodeId}`;
    endpoint = isMultilingual ? `/${lang}${endpoint}` : endpoint;
    const apiUrl = `${baseUrl}${endpoint}`;

    const payload = {
      data: {
        type: type,
        id: nodeId,
        attributes: {
          [fieldName]: JSON.stringify(data),
        },
      },
    };
    const client = createUserClient();
    const { token } = await client.auth.refreshToken();

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${token}`,
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
      {
        status: 'error',
        message: `Error updating Drupal node: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
      { status: 500 }
    );
  }

  revalidatePath(path);
  return NextResponse.json({ status: 'ok' });
}
