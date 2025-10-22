import { NextResponse } from 'next/server';
import { createServerClient } from '@/nodehive/client';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

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
    const query = searchParams.get('query');

    const apiParams = new DrupalJsonApiParams().addSort('created', 'DESC');
    // Create params object with filtering when query is provided
    if (query) {
      apiParams.addFilter('name', query, 'CONTAINS');
    }

    // Add pagination parameters
    const offset = searchParams.get('offset');
    const limit = searchParams.get('limit');
    if (offset) {
      apiParams.addPageOffset(Number(offset));
    }
    if (limit) {
      apiParams.addPageLimit(Number(limit));
    }

    if (type === 'image') {
      apiParams.addInclude(['field_media_image', 'thumbnail']);
      // Request common image style fields on the media entity
      apiParams.addFields('media--image', [
        'name',
        'thumbnail',
        'field_media_image',
      ]);
      // And on the file image resource to improve odds of having URIs
      apiParams.addFields('file--image', ['uri']);
    } else if (type === 'remote_video') {
      apiParams.addInclude(['thumbnail']);
      apiParams.addFields('media--remote_video', ['name', 'thumbnail']);
    } else if (type === 'video') {
      apiParams.addInclude(['field_media_image']);
      apiParams.addFields('media--video', [
        'name',
        'field_media_image',
        'field_media_video_file',
      ]);
    }

    const queryString = apiParams.getQueryString();

    let endpoint = `/jsonapi/media/${type}?${queryString}&jsonapi_include=1`;

    if (lang) {
      endpoint = `/${lang}${endpoint}`;
    }
    const url = `${process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        // Forward auth so JSON:API can include referenced files
        Authorization: `Bearer ${
          (await (await import('@/nodehive/auth')).getAuthToken()) || ''
        }`,
      },
    });
    const mediaItems = await response.json();
    return NextResponse.json(mediaItems);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
