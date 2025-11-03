import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { i18n } from '@/config/i18n-config';
import { createServerClient } from '@/lib/nodehive-client';

export async function getMediaSelectorList(
  type: string,
  lang: string,
  query?: string,
  offset?: string,
  limit?: string
) {
  const isMultilingual = i18n.isMultilingual;

  const apiParams = new DrupalJsonApiParams().addSort('created', 'DESC');
  // Create params object with filtering when query is provided
  if (query) {
    apiParams.addFilter('name', query, 'CONTAINS');
  }

  // Add pagination parameters
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
    apiParams.addFields('media--remote_video', [
      'name',
      'thumbnail',
      'field_media_oembed_video',
    ]);
  } else if (type === 'video') {
    apiParams.addInclude(['field_media_image']);
    apiParams.addFields('media--video', [
      'name',
      'field_media_image',
      'field_media_video_file',
    ]);
  }
  try {
    const client = await createServerClient();
    const medias = await client.getMediaList(type, {
      lang: isMultilingual ? lang : undefined,
      params: apiParams,
    });
    return medias;
  } catch (error) {
    console.error('Error fetching medias:', error);
    return null;
  }
}
