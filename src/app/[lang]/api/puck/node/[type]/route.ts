import { NextResponse } from 'next/server';
import { createServerClient } from '@/nodehive/client';

interface RouteParams {
  params: Promise<{
    lang: string;
    type: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { type, lang } = await params;

    const client = await createServerClient();
    const node = await client.getNodes(type, { lang });

    if (!node) {
      return NextResponse.json(
        { error: `Nodes not found: ${type}` },
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
