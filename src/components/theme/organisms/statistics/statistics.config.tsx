import { ComponentConfig } from '@measured/puck';

import Statistics from '@/components/theme/organisms/statistics/statistics';

export const StatisticsConfig: ComponentConfig = {
  label: 'Statistics',
  fields: {
    variant: {
      type: 'radio',
      label: 'Style',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Bordered', value: 'bordered' },
        { label: 'Subtle', value: 'subtle' },
      ],
    },
    stat1: {
      type: 'object',
      label: 'Statistic 1',
      objectFields: {
        title: {
          type: 'text',
          label: 'Title',
        },
        text: {
          type: 'textarea',
          label: 'Text (HTML)',
        },
      },
    },
    stat2: {
      type: 'object',
      label: 'Statistic 2',
      objectFields: {
        title: {
          type: 'text',
          label: 'Title',
        },
        text: {
          type: 'textarea',
          label: 'Text (HTML)',
        },
      },
    },
    stat3: {
      type: 'object',
      label: 'Statistic 3',
      objectFields: {
        title: {
          type: 'text',
          label: 'Title',
        },
        text: {
          type: 'textarea',
          label: 'Text (HTML)',
        },
      },
    },
  },
  defaultProps: {
    variant: 'default',
    stat1: {
      title: '250k',
      text: '<p>Transactions <strong>every 24 hours</strong></p>',
    },
    stat2: {
      title: '$119T',
      text: '<p>Assets under <strong>holding</strong></p>',
    },
    stat3: {
      title: '46,000',
      text: '<p>New users <strong>annually</strong></p>',
    },
  },
  render: ({ variant, stat1, stat2, stat3 }) => {
    return (
      <Statistics variant={variant} stat1={stat1} stat2={stat2} stat3={stat3} />
    );
  },
};
