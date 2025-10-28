import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { createServerClient } from '@/lib/nodehive-client';

export async function getSpaceNodes(language: string) {
  const spaceId = process.env.NEXT_PUBLIC_DRUPAL_NODEHIVE_SPACE_ID;

  if (!spaceId) {
    return [];
  }

  try {
    const client = await createServerClient();
    const apiParams = new DrupalJsonApiParams();

    // Filter nodes by space ID
    apiParams.addFilter(
      'nodehive_space.meta.drupal_internal__target_id',
      spaceId
    );

    // Add fields to include title and changed date
    apiParams.addFields('node--page', [
      'title',
      'changed',
      'drupal_internal__nid',
      'path',
      'langcode',
    ]);
    apiParams.addFields('node--article', [
      'title',
      'changed',
      'drupal_internal__nid',
      'path',
      'langcode',
    ]);
    apiParams.addFields('node--puck_page', [
      'title',
      'changed',
      'drupal_internal__nid',
      'path',
      'langcode',
    ]);

    // Sort by last edit date (most recent first)
    apiParams.addSort('changed', 'DESC');

    // Get all content types - we'll try common ones
    const pageNodes = await client
      .getNodes('page', { lang: language, params: apiParams })
      .catch(() => ({ data: [] }));
    const articleNodes = await client
      .getNodes('article', { lang: language, params: apiParams })
      .catch(() => ({ data: [] }));
    const puckPageNodes = await client
      .getNodes('puck_page', { lang: language, params: apiParams })
      .catch(() => ({ data: [] }));

    const allNodes = [
      ...(pageNodes?.data || []),
      ...(articleNodes?.data || []),
      ...(puckPageNodes?.data || []),
    ];

    // Sort all nodes by changed date
    allNodes.sort((a: any, b: any) => {
      const dateA = new Date(a.changed).getTime();
      const dateB = new Date(b.changed).getTime();
      return dateB - dateA;
    });

    return allNodes;
  } catch (error) {
    console.error('Error fetching space nodes:', error);
    return [];
  }
}
