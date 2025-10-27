import type { Meta, StoryObj } from '@storybook/react';

import { Heading } from './heading';

const sizeOptions = [
  'display-xxl',
  'display-xl',
  'xl',
  'lg',
  'md',
  'sm',
] as const;

const levelOptions = ['1', '2', '3', '4'] as const;

const meta = {
  title: 'Atoms Content/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: {
    level: '2',
    size: 'lg',
    children: 'Accessible heading text',
  },
  argTypes: {
    level: {
      control: 'radio',
      options: levelOptions,
    },
    size: {
      control: 'select',
      options: sizeOptions,
    },
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {};

export const Sizes: Story = {
  args: {
    level: '2',
  },
  render: (args) => (
    <div className="space-y-6">
      {sizeOptions.map((size) => (
        <Heading key={size} {...args} size={size}>
          {`Heading size ${size}`}
        </Heading>
      ))}
    </div>
  ),
};

export const Levels: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => (
    <div className="space-y-6">
      {levelOptions.map((level) => (
        <Heading key={level} {...args} level={level}>
          {`Heading level ${level}`}
        </Heading>
      ))}
    </div>
  ),
};
