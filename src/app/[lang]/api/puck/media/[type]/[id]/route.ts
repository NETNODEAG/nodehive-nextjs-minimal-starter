import { NextResponse } from 'next/server';

import { createServerClient } from '@/lib/nodehive-client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  try {
    const client = await createServerClient();
    const { id, type } = await params;
    const media = await client.getMedia(id, type);

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json(media.data);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
