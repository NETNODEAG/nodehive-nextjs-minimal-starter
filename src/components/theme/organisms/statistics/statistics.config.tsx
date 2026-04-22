import { ComponentConfig } from '@puckeditor/core';

import Statistics from '@/components/theme/organisms/statistics/statistics';

export const StatisticsConfig: ComponentConfig = {
  label: 'Statistics',
  ai: {
    description:
      'Row of big-number statistics with short descriptions. Columns auto-adapt to the item count.',
    instructions:
      'Use to highlight 3-4 key numbers that build trust (users, transactions, uptime, revenue). Every item is ALWAYS a number/metric on top + a short descriptive caption below — this pairing is mandatory. The title MUST be a number like "250K", "5000", "$100", "800+", "2003", "99.9%" — never a word, label, or sentence. The description is a short caption (2-6 words) describing what the number counts, e.g. "Projekte realisiert", "Expert*Innen", "Töggeli Matches gespielt", "New users annually". Drop inside a ContentSection to add an intro above.',
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
