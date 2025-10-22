import { NextRequest, NextResponse } from 'next/server';

/**
 * Fetches the latest sitemap data and generates the sitemap.
 * Returns the sitemap as XML.
 *
 * @returns {Promise} Promise object represents the generated sitemap as XML.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ lang: string }> }
): Promise<NextResponse> {
  const origin = req.nextUrl.origin;
  const lang = (await context.params).lang;

  try {
    const body = generateGlobalSitemap(origin, lang);

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Cache-control': 'public, s-maxage=60, stale-while-revalidate=60',
        'content-type': 'application/xml',
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'error',
        message: `There was a problem generating the sitemap: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

function generateGlobalSitemap(origin: string, locale: string) {
  const now = new Date()?.toISOString()?.replace(/\.\d{3}Z/, '+00:00');

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${origin}/${locale}/sitemap/sitemap-pages.xml</loc>
        <lastmod>${now}</lastmod>
      </url>
    </urlset>
  `;
}
