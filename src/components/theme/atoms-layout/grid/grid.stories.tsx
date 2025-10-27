import type { SlotComponent } from '@measured/puck';
import type { Meta, StoryObj } from '@storybook/react';

import Grid from './grid';

const mockCards = Array.from({ length: 6 }, (_, index) => ({
  id: index,
  title: `Card ${index + 1}`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}));

const mockContent: SlotComponent = (props) => (
  <div className={props?.className}>
    {mockCards.map((item) => (
      <div
        key={item.id}
        className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700"
      >
        <div className="font-semibold">{item.title}</div>
        <p className="mt-1 text-xs text-slate-500">{item.description}</p>
      </div>
    ))}
  </div>
);

const gridGapOptions = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const gridGapLabels: Record<(typeof gridGapOptions)[number], string> = {
  xs: 'xs (4px)',
  sm: 'sm (8px)',
  md: 'md (16px)',
  lg: 'lg (24px)',
  xl: 'xl (32px)',
  '2xl': '2xl (48px)',
};

const meta = {
  title: 'Atoms Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: {
    columns: 3,
    gap: 'md',
    content: mockContent,
  },
  argTypes: {
    content: {
      control: false,
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof Grid>;

export const Default: Story = {};

export const Columns: Story = {
  render: (args) => (
    <div className="space-y-8">
      {[2, 3, 4].map((columns) => (
        <div key={columns} className="space-y-2">
          <div className="text-sm font-semibold">{columns} columns</div>
          <Grid {...args} columns={columns} />
        </div>
      ))}
    </div>
  ),
};

export const Gaps: Story = {
  render: (args) => (
    <div className="space-y-8">
      {gridGapOptions.map((gap) => (
        <div key={gap} className="space-y-2">
          <div className="text-sm font-semibold">Gap: {gridGapLabels[gap]}</div>
          <Grid {...args} gap={gap} />
        </div>
      ))}
    </div>
  ),
};
