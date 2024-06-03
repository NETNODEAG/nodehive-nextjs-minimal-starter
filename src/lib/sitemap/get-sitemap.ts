import { createServerClient } from '@/nodehive/client';

/**
 * Create the response
 *
 * @param {string} body The response body
 *
 * @return {object} The response
 */
export function createResponse(body) {
  return new Response(body, {
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
 * @param {array} data The sitemap data
 *
 * @return {string} The sitemap
 */
export function generateSitemap(url, data, priority = 0.5) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${data
        .map((item) => {
          const path = item.path?.alias || `/node/${item.drupal_internal__nid}`;
          const changed = new Date(item.changed)
            .toISOString()
            .replace('Z', '+00:00');

          return `
            <url>
              <loc>${url}${path}</loc>
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

/**
 * Get the sitemap data - Pages data
 *
 * @return {Promise} Promise object represents the sitemap data
 */
export async function getSitemapPagesData() {
  const client = createServerClient();
  const pages = await client.getNodes('page');

  return pages?.data;
}
