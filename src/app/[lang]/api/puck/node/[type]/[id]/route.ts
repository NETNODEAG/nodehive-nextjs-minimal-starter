import { NextResponse } from 'next/server';
import { getNode } from '@/data/nodehive/nodes/get-node';

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
