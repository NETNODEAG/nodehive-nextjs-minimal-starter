import type { Meta, StoryObj } from '@storybook/react';

import Button from './button';

const variantOptions = ['primary', 'secondary', 'outline', 'ghost'] as const;

const meta = {
  title: 'UI /Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    variant: 'primary',
    children: 'Click me',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: variantOptions,
    },
    className: {
      control: false,
    },
    onClick: {
      action: 'clicked',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {variantOptions.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {`Button ${variant}`}
        </Button>
      ))}
    </div>
  ),
};
