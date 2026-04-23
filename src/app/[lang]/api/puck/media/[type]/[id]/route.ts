import { NextResponse } from 'next/server';
import { getMedia } from '@/data/nodehive/media/get-media';

import { requireEditor } from '@/lib/auth/require-editor';

interface RouteParams {
  params: Promise<{
    lang: string;
    type: string;
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const unauthorized = await requireEditor();
  if (unauthorized) return unauthorized;

  try {
    const { id, type, lang } = await params;
    const media = await getMedia(id, type, lang);

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const response = NextResponse.json(media);
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate'
    );
    return response;
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
