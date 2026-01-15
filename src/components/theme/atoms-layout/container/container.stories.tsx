import type { Meta, StoryObj } from '@storybook/react';

import Container from './container';

const widthOptions = ['full', 'wide', 'narrow'] as const;
const backgroundColorOptions = [
  'transparent',
  'white',
  'black',
  'primary',
  'secondary',
] as const;
const spacingYOptions = ['none', 'sm', 'md', 'lg', 'xl'] as const;
const spacingXOptions = ['none', 'md'] as const;

const widthLabels: Record<(typeof widthOptions)[number], string> = {
  full: 'full (fluid)',
  wide: 'wide (max 1280px)',
  narrow: 'narrow (max 896px)',
};

const meta = {
  title: 'Atoms Layout/Container',
  component: Container,
  tags: ['autodocs'],
  args: {
    width: 'wide',
    backgroundColor: 'transparent',
    spacingY: 'md',
    spacingX: 'md',
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
    backgroundColor: {
      control: 'select',
      options: backgroundColorOptions,
    },
    spacingY: {
      control: 'select',
      options: spacingYOptions,
    },
    spacingX: {
      control: 'select',
      options: spacingXOptions,
    },
    className: {
      control: false,
    },
    containerClassName: {
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
            Container width: {widthLabels[width]}
          </div>
        </Container>
      ))}
    </div>
  ),
};

export const BackgroundColors: Story = {
  render: (args) => (
    <div className="space-y-6">
      {backgroundColorOptions.map((backgroundColor) => (
        <Container
          key={backgroundColor}
          {...args}
          backgroundColor={backgroundColor}
          spacingY="md"
        >
          <div className="rounded-lg border border-dashed border-slate-400 bg-slate-50 p-6 text-sm text-slate-700">
            Background color: {backgroundColor}
          </div>
        </Container>
      ))}
    </div>
  ),
};

export const WithSpacing: Story = {
  args: {
    backgroundColor: 'primary',
    spacingY: 'lg',
  },
  render: (args) => (
    <Container {...args}>
      <div className="rounded-lg border border-dashed border-white bg-white/20 p-6 text-sm text-white">
        Container with vertical spacing and background color
      </div>
    </Container>
  ),
};
