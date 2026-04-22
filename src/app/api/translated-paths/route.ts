import { cacheLife } from 'next/cache';
import { NetworkError } from 'nodehive-js';

import { createServiceClient } from '@/lib/nodehive-client';

async function getTranslatedPaths(path: string) {
  'use cache';
  cacheLife('hours');

  const client = createServiceClient();
  try {
    return await client.getTranslatedPaths(path);
  } catch (error) {
    // Drupal returns 400 for paths it doesn't know about (frontend-only
    // routes, deleted nodes). Treat as "no translations" and cache the
    // empty result so we don't hammer Drupal for the same unknown path.
    if (error instanceof NetworkError && error.status === 400) {
      return {};
    }
    throw error;
  }
}

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path');

  if (!path) {
    return new Response('Missing path', { status: 400 });
  }

  try {
    const data = await getTranslatedPaths(path);
    return Response.json(data);
  } catch (error) {
    console.error('Failed to fetch translated paths:', error);
    return Response.json({}, { status: 502 });
  }
}
