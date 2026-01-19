import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { i18n } from '@/config/i18n-config';
import { createServerClient } from '@/lib/nodehive-client';

export async function getFragments(
  type: string,
  lang: string,
  query?: string,
  offset?: string,
  limit?: string
) {
  const isMultilingual = i18n.isMultilingual;

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

  // TODO Create a new function in nodehive-js
  try {
    const client = await createServerClient();

    const queryString = apiParams.getQueryString();
    const langPrefix = isMultilingual ? `/${lang}` : '';
    const endpoint = `${langPrefix}/jsonapi/nodehive_fragment/${type}?${queryString}&jsonapi_include=1`;
    const response = await client.request(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching fragments:', error);
    return null;
  }
}
