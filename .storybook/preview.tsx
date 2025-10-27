import type { Preview } from '@storybook/nextjs-vite';

import { helveticaNow, inter } from '../src/lib/fonts';

import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className={`${inter.variable} ${helveticaNow.variable} font-sans`}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
