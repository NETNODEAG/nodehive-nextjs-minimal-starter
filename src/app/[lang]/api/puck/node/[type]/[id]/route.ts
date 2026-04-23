import { NextResponse } from 'next/server';
import { getNode } from '@/data/nodehive/nodes/get-node';

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
    const { type, id, lang } = await params;

    const node = await getNode(id, type, lang);

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
