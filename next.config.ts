import path from 'path';
import { NextConfig } from 'next';

const imageDomains = process.env.NEXT_IMAGE_DOMAINS
  ? process.env.NEXT_IMAGE_DOMAINS.split(',').map((domain) => {
      const url = new URL(domain);
      return {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
      };
    })
  : [];

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  // Needed for making npm link work (only locally, breaks Vercel)
  ...(process.env.VERCEL
    ? {}
    : { outputFileTracingRoot: path.join(__dirname, '../') }),
  images: {
    remotePatterns: [...imageDomains],
    formats: ['image/avif', 'image/webp'],
  },
  staticPageGenerationTimeout: 120,
  turbopack: { rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } } },
};

export default nextConfig;
