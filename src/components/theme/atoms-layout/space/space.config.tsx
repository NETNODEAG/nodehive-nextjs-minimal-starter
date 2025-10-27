import { ComponentConfig } from '@measured/puck';

import Space, { SpaceProps } from '@/components/theme/atoms-layout/space/space';

export const SpaceConfig: ComponentConfig<SpaceProps> = {
  label: 'Abstand',
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
    },
  },
  defaultProps: {
    size: 'md',
  },
  render: ({ size }) => <Space size={size} />,
};
