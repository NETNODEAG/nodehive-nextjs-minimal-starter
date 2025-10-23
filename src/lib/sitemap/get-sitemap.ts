import { NextResponse } from 'next/server';
import { createServerClient } from '@/nodehive/client';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

/**
 * Create the response
 *
 * @param {string} body The response body
 *
 * @return {object} The response
 */
export function createResponse(body: string): NextResponse {
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=43200, stale-while-revalidate=43200',
      'content-type': 'application/xml',
    },
  });
}

/**
 * Generate the sitemap
 *
 * @param {string} origin The site origin
 * @param {array} data The sitemap data
 * @param {number} priority The priority of the sitemap
 *
 * @return {string} The sitemap
 */
export function generateSitemap(
  origin: string,
  data: any[],
  priority = 0.5
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${data
        .map((item) => {
          const path = item.path?.alias
            ? `/${item.path.langcode}${item.path.alias}`
            : `/${item.langcode}/node/${item.drupal_internal__nid}`;
          const changed = new Date(item.changed)
            .toISOString()
            .replace('Z', '+00:00');

          return `
            <url>
              <loc>${origin}${path}</loc>
              <lastmod>${changed}</lastmod>
              <changefreq>daily</changefreq>
              <priority>${priority}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;
}

export async function getSitemapData(
  type: string,
  language: string
): Promise<any> {
  const apiParams = new DrupalJsonApiParams();
  apiParams.addFilter('langcode', language);
  try {
    const client = await createServerClient();
    const data = (await client.getNodes(type, { params: apiParams })) as any;
    const nodes = data?.data || [];

    if (data?.links?.next) {
      const nextNodes = await getNextNodes(data.links.next.href);
      nodes.push(...nextNodes);
    }

    return nodes;
  } catch (error) {
    console.error('Error in getSitemapData:', error);
    throw error;
  }
}

async function getNextNodes(url: string): Promise<any> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    const nodes = data?.data || [];

    if (data?.links?.next) {
      const nextNodes = await getNextNodes(data.links.next.href);
      nodes.push(...nextNodes);
    }

    return nodes;
  } catch (error) {
    console.error('Error in getNextNodes:', error);
    throw error;
  }
}
