import { ComponentConfig } from '@measured/puck';

const spacingClasses = {
  sm: 'py-1 md:py-2',
  md: 'py-2 md:py-4',
  lg: 'py-4 md:py-6',
  xl: 'py-6 md:py-10',
  '2xl': 'py-10 md:py-20',
  '3xl': 'py-20 md:py-40',
} as const;

type SpaceProps = {
  size: keyof typeof spacingClasses;
};

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
  render: ({ size }) => <div className={spacingClasses[size]} />,
};
