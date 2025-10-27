import type { Meta, StoryObj } from '@storybook/react';

import TwoColumnsLayout from './two-columns';

const createMockBlock = (label: string) => {
  const Component = () => (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
      {label}
    </div>
  );
  Component.displayName = `MockBlock${label.replace(/\s+/g, '')}`;
  return Component;
};

const gapOptions = ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
const ratioOptions = ['1:1', '1:2', '2:1', '1:3', '3:1', '2:3', '3:2'] as const;

type Gap = (typeof gapOptions)[number];
type Ratio = (typeof ratioOptions)[number];

const gapToPxMap: Record<Gap, string> = {
  none: '0px',
  sm: 'base 4px · md 8px',
  md: 'base 8px · md 16px',
  lg: 'base 16px · md 24px',
  xl: 'base 24px · md 40px',
  '2xl': 'base 40px · md 80px',
  '3xl': 'base 80px · md 160px',
};

const meta = {
  title: 'Atoms Layout/Two Columns',
  component: TwoColumnsLayout,
  tags: ['autodocs'],
  args: {
    columnRatio: '1:1' as Ratio,
    gap: 'md' as Gap,
    reverseOrder: false,
    leftColumn: createMockBlock('Left column content'),
    rightColumn: createMockBlock('Right column content'),
  },
  argTypes: {
    columnRatio: {
      control: 'select',
      options: ratioOptions,
    },
    gap: {
      control: 'select',
      options: gapOptions,
    },
    leftColumn: {
      control: false,
    },
    rightColumn: {
      control: false,
    },
  },
} satisfies Meta<typeof TwoColumnsLayout>;

export default meta;

type Story = StoryObj<typeof TwoColumnsLayout>;

export const Default: Story = {};

export const Ratios: Story = {
  render: (args) => (
    <div className="space-y-8">
      {ratioOptions.map((ratio) => (
        <div key={ratio} className="space-y-2">
          <div className="text-sm font-semibold">Ratio: {ratio}</div>
          <TwoColumnsLayout {...args} columnRatio={ratio} />
        </div>
      ))}
    </div>
  ),
};

export const Reversed: Story = {
  args: {
    reverseOrder: true,
  },
};

export const Gaps: Story = {
  render: (args) => (
    <div className="space-y-8">
      {gapOptions.map((gap) => (
        <div key={gap} className="space-y-2">
          <div className="text-sm font-semibold">
            Gap: {gap}{' '}
            <span className="font-normal text-slate-500">
              ({gapToPxMap[gap]})
            </span>
          </div>
          <TwoColumnsLayout {...args} gap={gap} />
        </div>
      ))}
    </div>
  ),
};
