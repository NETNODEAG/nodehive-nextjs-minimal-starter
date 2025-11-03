import { NextResponse } from 'next/server';
import { getNodes } from '@/data/nodehive/nodes/get-nodes';

interface RouteParams {
  params: Promise<{
    lang: string;
    type: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { type, lang } = await params;

    const nodes = await getNodes(type, lang);

    if (!nodes) {
      return NextResponse.json(
        { error: `Nodes not found: ${type}` },
        { status: 404 }
      );
    }

    return NextResponse.json(nodes);
  } catch (error) {
    console.error('Error fetching node:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
