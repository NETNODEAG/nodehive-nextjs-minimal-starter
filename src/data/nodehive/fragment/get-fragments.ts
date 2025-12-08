import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { createServerClient } from '@/lib/nodehive-client';

export async function getFragments(
  type: string,
  lang: string,
  query?: string,
  offset?: string,
  limit?: string
) {
  const apiParams = new DrupalJsonApiParams().addSort('created', 'DESC');
  if (query) {
    apiParams.addFilter('title', query, 'CONTAINS');
  }

  if (offset) {
    apiParams.addPageOffset(Number(offset));
  }

  if (limit) {
    apiParams.addPageLimit(Number(limit));
  }

  apiParams.addInclude(['field_media', 'field_media.thumbnail']);

  // TODO Create a new function in nodehive-js
  try {
    const client = await createServerClient();

    const queryString = apiParams.getQueryString();
    const endpoint = `/jsonapi/nodehive_fragment/${type}?${queryString}&jsonapi_include=1`;
    const response = await client.request(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching medias:', error);
    return null;
  }
}
