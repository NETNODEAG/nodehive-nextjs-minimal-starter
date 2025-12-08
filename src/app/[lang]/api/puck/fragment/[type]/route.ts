import { NextResponse } from 'next/server';
import { getFragments } from '@/data/nodehive/fragment/get-fragments';

interface RouteParams {
  params: Promise<{
    lang: string;
    type: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { type, lang } = await params;
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') ?? undefined;
    const offset = searchParams.get('offset') ?? undefined;
    const limit = searchParams.get('limit') ?? undefined;

    const response = await getFragments(type, lang, query, offset, limit);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
