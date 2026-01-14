import { ComponentConfig } from '@puckeditor/core';

import Grid from '@/components/theme/atoms-layout/grid/grid';

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
  render: ({ columns, gap, content }) => (
    <Grid columns={columns} gap={gap} content={content} />
  ),
};
