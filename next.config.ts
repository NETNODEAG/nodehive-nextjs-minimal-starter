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
  images: {
    remotePatterns: [...imageDomains],
    formats: ['image/avif', 'image/webp'],
  },
  staticPageGenerationTimeout: 120,
  turbopack: { rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } } },
};

export default nextConfig;
