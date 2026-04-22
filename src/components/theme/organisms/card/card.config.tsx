import { ComponentConfig } from '@puckeditor/core';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

import Card from '@/components/theme/organisms/card/card';

// Create icon options from lucide-react icons
const iconOptions = [
  { label: 'None', value: '' },
  ...Object.keys(dynamicIconImports)
    .sort()
    .map((iconName) => ({
      label: iconName,
      value: iconName,
    })),
];

export const CardConfig: ComponentConfig = {
  label: 'Card',
  ai: {
    description:
      'Preformatted card with icon, title, description, and optional link. Designed to live inside a Grid.',
    instructions: 'Titles 2-5 words, descriptions 1-2 sentences.',
  },
  fields: {
    title: {
      type: 'text',
      label: 'Title',
    },
    description: {
      type: 'textarea',
      label: 'Description',
    },
    icon: {
      type: 'select',
      label: 'Icon',
      options: iconOptions,
    },
    mode: {
      type: 'radio',
      label: 'Style',
      options: [
        { label: 'Flat', value: 'flat' },
        { label: 'Card', value: 'card' },
      ],
    },
  },
  defaultProps: {
    title: 'Card Title',
    description:
      'This is a description for your card. Add relevant information here to engage your audience.',
    icon: 'sparkles',
    mode: 'flat',
  },
  render: ({ title, description, icon, mode }) => {
    return (
      <Card title={title} description={description} icon={icon} mode={mode} />
    );
  },
};
