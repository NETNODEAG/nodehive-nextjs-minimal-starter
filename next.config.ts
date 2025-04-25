import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ hostname: process.env.NEXT_IMAGE_DOMAIN }] },
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

module.exports = nextConfig;
