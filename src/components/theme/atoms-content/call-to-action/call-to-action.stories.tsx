import type { Meta, StoryObj } from '@storybook/react';

import CallToAction from './call-to-action';

const variantOptions = ['link', 'button', 'buttonOutline'] as const;
const sizeOptions = ['small', 'big'] as const;

const meta = {
  title: 'Atoms Content/CallToAction',
  component: CallToAction,
  tags: ['autodocs'],
  args: {
    href: '/',
    variant: 'link',
    size: 'small',
    children: 'Explore more',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: variantOptions,
    },
    size: {
      control: 'inline-radio',
      options: sizeOptions,
    },
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof CallToAction>;

export default meta;

type Story = StoryObj<typeof CallToAction>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {variantOptions.map((variant) => (
        <CallToAction key={variant} {...args} variant={variant}>
          {`CTA ${variant}`}
        </CallToAction>
      ))}
    </div>
  ),
};
