import type { Meta, StoryObj } from '@storybook/react';

import Space from './space';

const sizes = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

const sizeToPxMap: Record<(typeof sizes)[number], string> = {
  sm: 'base 4px · md 8px',
  md: 'base 8px · md 16px',
  lg: 'base 16px · md 24px',
  xl: 'base 24px · md 40px',
  '2xl': 'base 40px · md 80px',
  '3xl': 'base 80px · md 160px',
};

type SpaceSize = (typeof sizes)[number];

const meta = {
  title: 'Atoms Layout/Space',
  component: Space,
  tags: ['autodocs'],
  args: {
    size: 'md' as SpaceSize,
  },
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
    },
  },
} satisfies Meta<typeof Space>;

export default meta;

type Story = StoryObj<typeof Space>;

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-2">
      <div className="inline-block rounded bg-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-800">
        Above spacer
      </div>
      <Space {...args} />
      <div className="inline-block rounded bg-indigo-200 px-2 py-1 text-xs font-semibold text-indigo-800">
        Below spacer
      </div>
    </div>
  ),
};

export const Showcase: Story = {
  render: () => (
    <div className="space-y-6">
      {sizes.map((size) => (
        <div
          key={size}
          className="rounded-md border border-slate-200 bg-slate-50 p-4"
        >
          <div className="text-sm font-semibold">
            Size: {size}{' '}
            <span className="font-normal text-slate-500">
              ({sizeToPxMap[size]})
            </span>
          </div>
          <div className="text-xs text-slate-500">Visual spacer below:</div>
          <Space size={size} />
          <div className="text-xs text-slate-500">Content resumes</div>
        </div>
      ))}
    </div>
  ),
};
