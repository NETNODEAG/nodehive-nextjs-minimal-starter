import { ComponentConfig } from '@puckeditor/core';

import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';

export const BodyCopyConfig: ComponentConfig = {
  label: 'Body Copy',
  metadata: {
    ai: {
      description: 'Rich-text paragraph block.',
      instructions: 'Keep blocks short (2-4 sentences).',
    },
  },
  fields: {
    text: {
      type: 'richtext',
      label: 'Text',
    },
    size: {
      label: 'Size',
      type: 'select',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'base', label: 'Base' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
        { value: '2xl', label: '2X Large' },
      ],
    },
  },
  defaultProps: {
    size: 'base',
    text: '<p>Write a short, clear paragraph that explains the idea and keeps the reader moving.</p>',
  },
  render: ({ size, text }) => <BodyCopy size={size}>{text}</BodyCopy>,
};
