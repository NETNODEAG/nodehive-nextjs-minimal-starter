import type { Meta, StoryObj } from '@storybook/react';

import Card from './card';

const modeOptions = ['flat', 'card'] as const;

const meta = {
  title: 'Organisms/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    mode: 'card',
    title: 'Insightful analytics',
    description:
      'Leverage actionable insights to understand your audience and make informed decisions about your content.',
    icon: 'Activity',
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: modeOptions,
    },
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const Modes: Story = {
  render: (args) => (
    <div className="grid gap-6 md:grid-cols-2">
      {modeOptions.map((mode) => (
        <Card key={mode} {...args} mode={mode} />
      ))}
    </div>
  ),
};
