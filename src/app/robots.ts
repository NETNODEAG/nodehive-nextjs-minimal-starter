import { MetadataRoute } from 'next';
import { i18n } from '@/nodehive/i18n-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: i18n.locales.map(
      (locale) =>
        `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${locale}/sitemap.xml`
    ),
  };
}
