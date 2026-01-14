import { ComponentConfig } from '@puckeditor/core';

import { Heading } from '@/components/theme/atoms-content/heading/heading';

export const HeadingConfig: ComponentConfig = {
  label: 'Heading',
  fields: {
    text: {
      type: 'text',
      label: 'Text',
      contentEditable: true,
    },
    size: {
      type: 'select',
      label: 'Grösse',
      options: [
        { label: 'Display XXL', value: 'display-xxl' },
        { label: 'Display XL', value: 'display-xl' },
        { label: 'Extra Large', value: 'xl' },
        { label: 'Large', value: 'lg' },
        { label: 'Medium', value: 'md' },
        { label: 'Small', value: 'sm' },
      ],
    },
    level: {
      type: 'select',
      label: 'Level',
      options: [
        { label: 'H1', value: '1' },
        { label: 'H2', value: '2' },
        { label: 'H3', value: '3' },
        { label: 'H4', value: '4' },
      ],
    },
  },
  defaultProps: {
    text: 'Überschrift',
    size: 'lg',
    level: '2',
  },
  render: ({ text, level, size }) => {
    return (
      <Heading level={level} size={size}>
        {text}
      </Heading>
    );
  },
};
