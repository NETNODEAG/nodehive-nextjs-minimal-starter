import { ComponentConfig } from '@puckeditor/core';

import Statistics from '@/components/theme/organisms/statistics/statistics';

export const StatisticsConfig: ComponentConfig = {
  label: 'Statistics',
  fields: {
    items: {
      type: 'array',
      label: 'Statistics',
      min: 1,
      max: 6,
      arrayFields: {
        title: {
          type: 'text',
          label: 'Title',
        },
        text: {
          type: 'richtext',
          label: 'Text',
        },
      },
      defaultItemProps: {
        title: 'New Stat',
        text: '<p>Description</p>',
      },
      getItemSummary: (item) => item.title || 'Statistic',
    },
    variant: {
      type: 'radio',
      label: 'Style',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Bordered', value: 'bordered' },
        { label: 'Subtle', value: 'subtle' },
      ],
    },
  },
  defaultProps: {
    variant: 'default',
    items: [
      {
        title: '250k',
        text: '<p>Transactions <strong>every 24 hours</strong></p>',
      },
      {
        title: '$119T',
        text: '<p>Assets under <strong>holding</strong></p>',
      },
      {
        title: '46,000',
        text: '<p>New users <strong>annually</strong></p>',
      },
    ],
  },
  render: ({ variant, items }) => {
    return <Statistics variant={variant} items={items} />;
  },
};
