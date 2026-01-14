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
  fields: {
    title: {
      type: 'text',
      label: 'Title',
      contentEditable: true,
    },
    description: {
      type: 'textarea',
      label: 'Description',
      contentEditable: true,
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
    icon: 'Sparkles',
    mode: 'flat',
  },
  render: ({ title, description, icon, mode }) => {
    return (
      <Card title={title} description={description} icon={icon} mode={mode} />
    );
  },
};
