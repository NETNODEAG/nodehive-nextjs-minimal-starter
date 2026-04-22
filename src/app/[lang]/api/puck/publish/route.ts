import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { requireEditor } from '@/lib/auth/require-editor';
import { createUserClient } from '@/lib/nodehive-client';

// Whitelists guard against attribute-write / path-injection via the
// user-controlled request body. Drupal's JSON:API ACL is a secondary line
// of defence, but we fail fast here so a malformed / malicious payload never
// reaches the CMS.
const ALLOWED_FIELD_NAMES = new Set([
  'field_puck_data',
  'field_puck_template_data',
]);
const TYPE_RE = /^[a-z_]+(--[a-z_]+)?$/;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireEditor();
  if (unauthorized) return unauthorized;

  const { path, type, data, nodeId, fieldName, lang, pageSettings } =
    await request.json();

  if (
    typeof fieldName !== 'string' ||
    !ALLOWED_FIELD_NAMES.has(fieldName) ||
    typeof type !== 'string' ||
    !TYPE_RE.test(type) ||
    typeof nodeId !== 'string' ||
    !UUID_RE.test(nodeId)
  ) {
    return NextResponse.json(
      { status: 'error', message: 'invalid fieldName, type, or nodeId' },
      { status: 400 }
    );
  }

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
      if (alias) {
        attributes.path = {
          alias: alias.startsWith('/') ? alias : `/${alias}`,
        };
      }
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
    // Surface Drupal's JSON:API error body so we don't just see
    // "HTTP 500: Internal Server Error" — the real cause lives in details.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const details = (error as any)?.details;
    console.error('Error updating Drupal node:', error);
    if (details) {
      console.error(
        'Drupal response details:',
        JSON.stringify(details, null, 2)
      );
    }
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
