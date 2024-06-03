function generateGlobalSitemap(url) {
  const now = new Date();
  let date = now.toISOString();
  date = date.replace(/\.\d{3}Z/, '+00:00');

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${url}/sitemap/sitemap-pages.xml</loc>
        <lastmod>${date}</lastmod>
      </url>
    </urlset>
  `;
}

/**
 * Fetches the latest sitemap data and generates the sitemap.
 * Returns the sitemap as XML.
 *
 * @returns {Promise} Promise object represents the generated sitemap as XML.
 */
export async function GET(req) {
  const url = req.nextUrl.origin;

  try {
    const body = generateGlobalSitemap(url);

    return new Response(body, {
      status: 200,
      headers: {
        'Cache-control': 'public, s-maxage=60, stale-while-revalidate=60',
        'content-type': 'application/xml',
      },
    });
  } catch (error) {
    console.error(
      `There was a problem generating the sitemap: ${error.message}`
    );
  }
}
