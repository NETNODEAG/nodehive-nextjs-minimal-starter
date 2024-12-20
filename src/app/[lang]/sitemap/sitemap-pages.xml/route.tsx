import { NextRequest } from 'next/server';

import {
  createResponse,
  generateSitemap,
  getSitemapData,
} from '@/lib/sitemap/get-sitemap';

/**
 * The priority of this sitemap relative to other sitemaps.
 * Valid values range from 0.0 to 1.0.
 * The default priority of a page is 0.5.
 */
const PRIOTITY = 1.0;

/**
 * Fetches the news sitemap data and generates the sitemap.
 * Returns the sitemap as XML.
 *
 * @returns {Promise} Promise object represents the generated sitemap as XML.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ lang: string }> }
): Promise<Response> {
  const origin = req.nextUrl.origin;
  const lang = (await context.params).lang;

  try {
    const data = await getSitemapData('page', lang);

    // safer and more appropriate way to check if the array is empty
    if (data.content === '[]') {
      let body = `<?xml version="1.0" encoding="UTF-8"?>`;
      body += `<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">`;
      body += `</urlset>`;

      return createResponse(body);
    }

    const body = generateSitemap(origin, data, PRIOTITY);
    return createResponse(body);
  } catch (error) {
    console.error(
      `There was a problem generating the sitemap: ${error.message}`
    );
  }
}
