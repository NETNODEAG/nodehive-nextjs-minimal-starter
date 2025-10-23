import { ComponentConfig } from '@measured/puck';

import { cn } from '@/lib/utils';

const columnClasses = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
} as const;

const gapClasses = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
} as const;

export const GridConfig: ComponentConfig = {
  fields: {
    content: {
      type: 'slot',
    },
    columns: {
      type: 'number',
      min: 1,
      max: 12,
    },
    gap: {
      type: 'select',
      options: [
        { label: 'XS (4px)', value: 'xs' },
        { label: 'SM (8px)', value: 'sm' },
        { label: 'MD (16px)', value: 'md' },
        { label: 'LG (24px)', value: 'lg' },
        { label: 'XL (32px)', value: 'xl' },
        { label: '2XL (48px)', value: '2xl' },
      ],
    },
  },
  defaultProps: {
    columns: 2,
    gap: 'md',
  },
  render: ({ columns, gap, content: Content }) => (
    <Content
      className={cn(
        'grid grid-cols-1',
        columnClasses[columns as keyof typeof columnClasses],
        gapClasses[gap as keyof typeof gapClasses]
      )}
    />
  ),
};
