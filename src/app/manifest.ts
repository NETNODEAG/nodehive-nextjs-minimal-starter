import { MetadataRoute } from 'next';
import { spaceConfig } from '@/nodehive/space-config';

export default function manifest(): MetadataRoute.Manifest {
  const { siteName, shortName, themeColor, spaceMetadata } = spaceConfig;

  return {
    name: siteName,
    short_name: shortName,
    description: spaceMetadata.description,
    start_url: '/',
    icons: [
      {
        src: '/metadata/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/metadata/icon1.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/metadata/icon2.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/metadata/icon3.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/metadata/icon4.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/metadata/icon5.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: themeColor,
  };
}
