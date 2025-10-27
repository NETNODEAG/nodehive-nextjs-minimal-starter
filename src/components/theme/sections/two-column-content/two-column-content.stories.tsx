import type { Meta, StoryObj } from '@storybook/react';

import TwoColumnContent from './two-column-content';

const backgroundOptions = ['none', 'light'] as const;
const ratioOptions = ['1:1', '1:2', '2:1'] as const;
const gapOptions = ['sm', 'md', 'lg', 'xl'] as const;
const imagePositionOptions = ['left', 'right'] as const;

const meta = {
  title: 'Sections/TwoColumnContent',
  component: TwoColumnContent,
  tags: ['autodocs'],
  args: {
    background: 'none',
    title: 'Launch faster with reusable components',
    bodyText:
      '<p>Compose flexible layouts that adapt to your content strategy. Each section keeps design and development perfectly aligned.</p>',
    imageUrl: '/metadata/og-image.jpg',
    imageAlt: 'Team celebrating a product launch',
    imagePosition: 'right',
    columnRatio: '1:1',
    gap: 'md',
  },
  argTypes: {
    background: {
      control: 'inline-radio',
      options: backgroundOptions,
    },
    columnRatio: {
      control: 'inline-radio',
      options: ratioOptions,
    },
    gap: {
      control: 'inline-radio',
      options: gapOptions,
    },
    imagePosition: {
      control: 'inline-radio',
      options: imagePositionOptions,
    },
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof TwoColumnContent>;

export default meta;

type Story = StoryObj<typeof TwoColumnContent>;

export const Default: Story = {};

export const Layouts: Story = {
  render: (args) => (
    <div className="space-y-12">
      {ratioOptions.map((ratio) => (
        <TwoColumnContent
          key={ratio}
          {...args}
          columnRatio={ratio}
          imagePosition={ratio === '2:1' ? 'left' : 'right'}
        />
      ))}
    </div>
  ),
};
