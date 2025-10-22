import { NextConfig } from 'next';

const imageDomains = process.env.NEXT_IMAGE_DOMAINS
  ? process.env.NEXT_IMAGE_DOMAINS.split(',').map((domain) => new URL(domain))
  : [];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [...imageDomains],
    formats: ['image/avif', 'image/webp'],
  },
  staticPageGenerationTimeout: 120,
  turbopack: { rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } } },
};

export default nextConfig;
