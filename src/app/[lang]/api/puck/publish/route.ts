import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { createUserClient } from '@/lib/nodehive-client';

export async function PATCH(request: NextRequest) {
  const { path, type, data, nodeId, fieldName, lang } = await request.json();
  console.log('Publishing Puck data for node', nodeId, 'field', fieldName);

  const jsonApiType = type.replace('node--', '');
  try {
    const client = createUserClient();
    const endpoint = `/jsonapi/node/${jsonApiType}/${nodeId}`;
    const payload = {
      data: {
        type: type,
        id: nodeId,
        attributes: {
          [fieldName]: JSON.stringify(data),
        },
      },
    };

    await client.request(endpoint, {
      method: 'PATCH',
      lang,
      data: payload,
      headers: { Accept: 'application/vnd.api+json' },
    });

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
