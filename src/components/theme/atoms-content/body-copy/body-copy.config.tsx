import { ComponentConfig } from '@puckeditor/core';

import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';

export const BodyCopyConfig: ComponentConfig = {
  label: 'Body Copy',
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
    text: '<p>Dies ist ein Textbereich, in dem Sie Ihren Inhalt hinzufügen können</p>',
  },
  render: ({ size, text }) => <BodyCopy size={size}>{text}</BodyCopy>,
};
