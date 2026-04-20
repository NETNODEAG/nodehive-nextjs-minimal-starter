import { ComponentConfig } from '@puckeditor/core';

import Grid from '@/components/theme/atoms-layout/grid/grid';

export const GridConfig: ComponentConfig = {
  label: 'Grid',
  ai: {
    description:
      'Multi-column grid layout for equal-width children. Typically contains Cards.',
  },
  fields: {
    content: {
      type: 'slot',
      allow: [
        'Card',
        'Statistics',
        'Heading',
        'BodyCopy',
        'CallToAction',
        'Image',
        'Video',
      ],
    },
    columns: {
      type: 'number',
      min: 1,
      max: 12,
      metadata: {
        ai: {
          instructions:
            'Pick based on item count (3 items = 3 cols, 4 items = 2 or 4 cols).',
        },
      },
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
