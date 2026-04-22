import type { Meta, StoryObj } from '@storybook/react';

import Statistics from './statistics';

const meta = {
  title: 'Organisms/Statistics',
  component: Statistics,
  tags: ['autodocs'],
  args: {
    items: [
      { title: '250k', text: 'Transactions every 24 hours' },
      { title: '$119T', text: 'Assets under holding' },
      { title: '46,000', text: 'New users annually' },
    ],
  },
} satisfies Meta<typeof Statistics>;

export default meta;

type Story = StoryObj<typeof Statistics>;

export const Three: Story = {};

export const Four: Story = {
  args: {
    items: [
      { title: '99.9%', text: 'Uptime' },
      { title: '250k', text: 'Transactions per day' },
      { title: '$119T', text: 'Assets under holding' },
      { title: '46,000', text: 'New users annually' },
    ],
  },
};
