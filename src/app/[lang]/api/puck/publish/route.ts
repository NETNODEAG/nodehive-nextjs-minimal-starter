import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { i18n } from '@/config/i18n-config';
import { createUserClient } from '@/lib/nodehive-client';

export async function PATCH(request: NextRequest) {
  const { path, type, data, nodeId, fieldName, lang, pageSettings } =
    await request.json();
  console.log('Publishing Puck data for node', nodeId, 'field', fieldName);

  const jsonApiType = type.replace('node--', '');
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL;

    const isMultilingual = i18n.isMultilingual;
    let endpoint = `/jsonapi/node/${jsonApiType}/${nodeId}`;
    endpoint = isMultilingual ? `/${lang}${endpoint}` : endpoint;
    const apiUrl = `${baseUrl}${endpoint}`;

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

    const payload = {
      data: {
        type: type,
        id: nodeId,
        attributes,
        ...(Object.keys(relationships).length > 0 ? { relationships } : {}),
      },
    };
    const client = createUserClient();
    let token = null;
    try {
      token = await client.auth.getToken();
    } catch (error) {
      console.error('Error getting token', error);
    }

    if (!token) {
      try {
        const response = await client.auth.refreshToken();
        token = response.token;
      } catch (error) {
        console.error('Error refreshing token', error);
      }
    }

    if (!token) {
      throw new Error('Unable to retrieve authentication token');
    }

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
