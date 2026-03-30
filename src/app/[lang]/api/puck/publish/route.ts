import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { createUserClient } from '@/lib/nodehive-client';

export async function PATCH(request: NextRequest) {
  const { path, type, data, nodeId, fieldName, lang, pageSettings } =
    await request.json();
  console.log('Publishing Puck data for node', nodeId, 'field', fieldName);

  const jsonApiType = type.replace('node--', '');
  try {
    const attributes: Record<string, unknown> = {
      [fieldName]: JSON.stringify(data),
    };

    if (typeof pageSettings?.metadataTitle === 'string') {
      attributes.field_metadata_title = pageSettings.metadataTitle;
    }

    if (typeof pageSettings?.metadataDescription === 'string') {
      attributes.field_metadata_description = pageSettings.metadataDescription;
    }

    if (typeof pageSettings?.published === 'boolean') {
      attributes.status = pageSettings.published;
    }

    if (typeof pageSettings?.urlAlias === 'string') {
      const alias = pageSettings.urlAlias.trim();
      attributes.path = {
        alias: alias ? (alias.startsWith('/') ? alias : `/${alias}`) : null,
      };
    }

    const relationships: Record<string, unknown> = {};
    if (pageSettings?.metadataImage === null) {
      relationships.field_metadata_image = {
        data: null,
      };
    } else if (pageSettings?.metadataImage?.id) {
      relationships.field_metadata_image = {
        data: {
          type: pageSettings.metadataImage.type || 'media--image',
          id: pageSettings.metadataImage.id,
        },
      };
    }

    const client = createUserClient();
    const endpoint = `/jsonapi/node/${jsonApiType}/${nodeId}`;
    const payload = {
      data: {
        type: type,
        id: nodeId,
        attributes,
        ...(Object.keys(relationships).length > 0 ? { relationships } : {}),
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
