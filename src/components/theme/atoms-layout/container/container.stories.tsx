import type { Meta, StoryObj } from '@storybook/react';

import Container from './container';

const widthOptions = ['full', 'wide', 'narrow'] as const;

const meta = {
  title: 'Atoms Layout/Container',
  component: Container,
  tags: ['autodocs'],
  args: {
    width: 'wide',
    children: (
      <div className="rounded-lg border border-dashed border-slate-400 bg-slate-50 p-6 text-sm text-slate-700">
        Content inside the container
      </div>
    ),
  },
  argTypes: {
    width: {
      control: 'inline-radio',
      options: widthOptions,
    },
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof Container>;

export const Default: Story = {};

export const Widths: Story = {
  render: (args) => (
    <div className="space-y-6">
      {widthOptions.map((width) => (
        <Container key={width} {...args} width={width}>
          <div className="rounded-lg border border-dashed border-slate-400 bg-slate-50 p-6 text-sm text-slate-700">
            {`Container width: ${width}`}
          </div>
        </Container>
      ))}
    </div>
  ),
};
