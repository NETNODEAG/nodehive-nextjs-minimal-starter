import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: [
    '../public',
    { from: '../src/assets/fonts', to: '/src/assets/fonts' },
  ],
  framework: '@storybook/nextjs',
  webpackFinal: async (config) => {
    config?.module?.rules
      ?.filter(
        (rule) =>
          typeof rule === 'object' &&
          rule !== null &&
          'test' in rule &&
          typeof rule.test === 'object' &&
          'test' in rule.test &&
          rule?.test?.test('.svg')
      )
      .forEach((rule) => {
        if (typeof rule === 'object' && rule !== null) {
          rule.exclude! = /\.svg$/i;
        }
      });

    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default config;
