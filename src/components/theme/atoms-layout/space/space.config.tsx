import { ComponentConfig } from '@puckeditor/core';

import Space, { SpaceProps } from '@/components/theme/atoms-layout/space/space';

export const SpaceConfig: ComponentConfig<SpaceProps> = {
  label: 'Abstand',
  metadata: {
    ai: {
      description: 'Vertical spacer between other components.',
      instructions:
        'Only use when default section spacing is not enough; prefer Container/section padding when possible.',
    },
  },
  fields: {
    size: {
      label: 'Grösse',
      type: 'select',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
      ],
      metadata: {
        ai: {
          instructions:
            'sm/md: between related content blocks. lg/xl: between page sections. 2xl/3xl: strong visual separation between distinct areas.',
        },
      },
    },
  },
  defaultProps: {
    size: 'md',
  },
  render: ({ size }) => <Space size={size} />,
};
