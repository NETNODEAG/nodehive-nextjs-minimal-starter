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
    layout: 'stacked',
    variant: '1',
  },
  argTypes: {
    background: {
      control: 'inline-radio',
      options: ['none', 'light'],
    },
    layout: {
      control: 'inline-radio',
      options: ['stacked', 'centered', 'content-left', 'media-left'],
    },
    variant: {
      control: 'inline-radio',
      options: ['1', '2', '3'],
    },
  },
} satisfies Meta<typeof ContentSection>;

export default meta;

type Story = StoryObj<typeof ContentSection>;

export const Default: Story = {};

export const Centered: Story = {
  args: {
    layout: 'centered',
  },
};

export const ContentLeft: Story = {
  args: {
    layout: 'content-left',
  },
};

export const MediaLeft: Story = {
  args: {
    layout: 'media-left',
  },
};
