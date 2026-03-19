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

  try {
    const client = await createServerClient();
    const response = await client.getFragments(type, { lang, params: apiParams });
    return response;
  } catch (error) {
    console.error('Error fetching fragments:', error);
    return null;
  }
}
