import type { Meta, StoryObj } from '@storybook/react';

import Statistics from './statistics';

const variantOptions = ['default', 'bordered', 'subtle'] as const;

const meta = {
  title: 'Organisms/Statistics',
  component: Statistics,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    items: [
      {
        title: '98%',
        text: '<p>Customer satisfaction rating reported across platforms.</p>',
      },
      {
        title: '24/7',
        text: '<p>Support coverage to keep your digital presence running smoothly.</p>',
      },
      {
        title: '120+',
        text: '<p>Successful launches delivered by the team this year.</p>',
      },
    ],
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: variantOptions,
    },
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof Statistics>;

export default meta;

type Story = StoryObj<typeof Statistics>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="space-y-12">
      {variantOptions.map((variant) => (
        <Statistics key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};
