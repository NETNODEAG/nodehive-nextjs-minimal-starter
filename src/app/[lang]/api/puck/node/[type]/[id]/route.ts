import { NextResponse } from 'next/server';
import { createServerClient } from '@/nodehive/client';

interface RouteParams {
  params: Promise<{
    lang: string;
    type: string;
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { type, id, lang } = await params;

    const client = await createServerClient();
    const node = await client.getNode(id, type, { lang });

    if (!node) {
      return NextResponse.json(
        { error: `Node not found: ${type}/${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(node.data);
  } catch (error) {
    console.error('Error fetching node:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
