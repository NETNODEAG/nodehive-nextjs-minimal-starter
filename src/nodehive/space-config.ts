export const spaceConfig = {
  siteName: 'NodeHive Next.js Starter',
  shortName: 'NH',
  shortUrl: 'nodehive.ch',
  themeColor: '#ffffff',
  url: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
  spaceMetadata: {
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
    title: {
      template: '%s | NodeHive',
      default: 'NodeHive Next.js Starter',
    },
    description: 'nodehive-nextjs-starter Template',
    ogImage: '/metadata/og-image.jpg',
    icons: {
      icon: [
        { url: '/metadata/icon1.png' },
        { url: '/metadata/icon2.png' },
        { url: '/metadata/icon3.png' },
        { url: '/metadata/icon4.png' },
        { url: '/metadata/icon5.png' },
      ],
      shortcut: ['/metadata/favicon.ico'],
      apple: [{ url: '/metadata/apple-icon.png' }],
      other: [],
    },
    openGraph: {
      siteName: 'NodeHive',
      title: 'Next.js Starter',
      description: 'nodehive-nextjs-starter Template',
      type: 'website',
      images: [
        {
          url: '/metadata/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'NodeHive Next.js Starter',
        },
      ],
    },
  },
};
