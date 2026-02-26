import type { Meta, StoryObj } from '@storybook/react';

import ContentSection from './content-section';

const meta = {
  title: 'Sections/ContentSection',
  component: ContentSection,
  tags: ['autodocs'],
  args: {
    title: 'Why Choose Our Platform',
    eyebrow: 'Features',
    body: '<p>We provide the tools and infrastructure you need to build exceptional digital experiences.</p>',
    background: 'none',
    align: 'left',
  },
  argTypes: {
    background: {
      control: 'inline-radio',
      options: ['none', 'light', 'dark'],
    },
    align: {
      control: 'inline-radio',
      options: ['left', 'center'],
    },
  },
} satisfies Meta<typeof ContentSection>;

export default meta;

type Story = StoryObj<typeof ContentSection>;

export const Default: Story = {};

export const Centered: Story = {
  args: {
    align: 'center',
  },
};

export const DarkBackground: Story = {
  args: {
    background: 'dark',
  },
};
