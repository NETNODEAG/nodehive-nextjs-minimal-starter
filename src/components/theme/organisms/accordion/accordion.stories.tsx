import type { Meta, StoryObj } from '@storybook/react';

import Accordion from './accordion';

const meta = {
  title: 'Organisms/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    items: [
      {
        question: 'What is included in the plan?',
        content: 'Everything you need to get started.',
      },
      {
        question: 'Can I cancel anytime?',
        content: 'Yes, you can cancel with a single click.',
      },
      {
        question: 'Do you offer a free trial?',
        content: 'Yes, 14 days, no credit card required.',
      },
    ],
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};

export const OpenInEditMode: Story = {
  args: {
    isEditing: true,
  },
};
