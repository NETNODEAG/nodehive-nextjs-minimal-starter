import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname:
          process.env.NEXT_IMAGE_DOMAIN?.replace(/https?:\/\//, '') || '',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  staticPageGenerationTimeout: 120,
  turbopack: { rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } } },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      // issuer: /\.[jt]sx?$/, https://github.com/vercel/next.js/issues/48177
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
