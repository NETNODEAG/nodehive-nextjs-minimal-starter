import { cacheLife } from 'next/cache';

import { createServiceClient } from '@/lib/nodehive-client';

async function getTranslatedPaths(path: string) {
  'use cache';
  cacheLife('hours');

  const client = createServiceClient();
  return client.getTranslatedPaths(path);
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
