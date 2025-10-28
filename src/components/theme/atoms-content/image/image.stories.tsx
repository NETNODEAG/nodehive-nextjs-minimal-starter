import type { Meta, StoryObj } from '@storybook/react';

import Image from './image';

const aspectRatioOptions = ['16/9', '4/3', '1/1', '3/2', '21/9'] as const;

const meta = {
  title: 'Atoms Content/Image',
  parameters: {
    layout: 'padded',
  },
  component: Image,
  tags: ['autodocs'],
  args: {
    src: '/metadata/og-image.jpg',
    alt: 'NodeHive example image',
  },
  argTypes: {
    aspectRatio: {
      control: 'select',
      options: aspectRatioOptions,
    },
  },
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {};

export const AspectRatios: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-6">
      {aspectRatioOptions.map((ratio) => (
        <div key={ratio} className="space-y-3">
          <div className="text-sm font-semibold">Aspect ratio: {ratio}</div>
          <Image {...args} aspectRatio={ratio} alt={args.alt} />
        </div>
      ))}
    </div>
  ),
};
