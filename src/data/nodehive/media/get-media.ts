import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { i18n } from '@/config/i18n-config';
import { createServerClient } from '@/lib/nodehive-client';

export async function getMedia(id: string, type: string, lang: string) {
  const isMultilingual = i18n.isMultilingual;
  const apiParams = new DrupalJsonApiParams();
  if (type === 'image') {
    apiParams.addInclude(['field_media_image', 'thumbnail']);
    apiParams.addFields('media--image', [
      'name',
      'thumbnail',
      'field_media_image',
    ]);
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
    const media = await client.getMedia(id, type, {
      lang: isMultilingual ? lang : undefined,
      params: apiParams,
    });
    return media;
  } catch (error) {
    console.error('Error fetching media:', error);
    return null;
  }
}
