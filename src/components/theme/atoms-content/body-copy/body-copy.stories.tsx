import type { Meta, StoryObj } from '@storybook/react';

import BodyCopy from './body-copy';

const sizeOptions = ['sm', 'base', 'lg', 'xl', '2xl'] as const;

const meta = {
  title: 'Atoms Content/BodyCopy',
  component: BodyCopy,
  tags: ['autodocs'],
  args: {
    size: 'base',
    children:
      '<p>This is sample body copy. It accepts <strong>HTML</strong> content and keeps consistent typography spacing.</p>',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizeOptions,
    },
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof BodyCopy>;

export default meta;

type Story = StoryObj<typeof BodyCopy>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-6">
      {sizeOptions.map((size) => (
        <BodyCopy key={size} {...args} size={size}>
          {`Body copy in ${size} size displayed with a short sentence.`}
        </BodyCopy>
      ))}
    </div>
  ),
};
