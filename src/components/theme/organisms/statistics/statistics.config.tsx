import { ComponentConfig } from '@puckeditor/core';

import Statistics from '@/components/theme/organisms/statistics/statistics';

export const StatisticsConfig: ComponentConfig = {
  label: 'Statistics',
  ai: {
    description:
      'Row of big-number statistics with short descriptions. Columns auto-adapt to the item count.',
    instructions:
      'Use to highlight 3-4 key numbers that build trust (users, transactions, uptime, revenue). Keep the number short and visually striking; put the explanation in the description. Drop inside a ContentSection to add an intro above.',
  },
  fields: {
    items: {
      type: 'array',
      label: 'Statistics',
      min: 1,
      max: 6,
      arrayFields: {
        title: {
          type: 'text',
          label: 'Number (required)',
          contentEditable: true,
          metadata: {
            ai: {
              instructions:
                'MUST be a concise number or metric formatted as a string — e.g. "250k", "$119T", "46,000", "99.9%", "4.8★". This is the big visual centerpiece of the item. Never use a word or full sentence here.',
            },
          },
        },
        text: {
          type: 'richtext',
          label: 'Description',
          contentEditable: true,
          metadata: {
            ai: {
              instructions:
                'Short caption below the number (2-8 words): what the number counts. Example: "New users annually", "Assets under holding".',
            },
          },
        },
      },
      defaultItemProps: {
        title: '100+',
        text: '<p>Description</p>',
      },
      getItemSummary: (item) => item.title || 'Statistic',
    },
  },
  defaultProps: {
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
  render: ({ items }) => <Statistics items={items} />,
};
