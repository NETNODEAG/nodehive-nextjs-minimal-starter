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
    width: 'wide',
    textWidth: 'narrow',
    slotWidth: 'wide',
    contentPosition: 'left',
    split: '50-50',
    reverseOnMobile: false,
  },
  argTypes: {
    background: {
      control: 'inline-radio',
      options: ['none', 'light'],
    },
    layout: {
      control: 'inline-radio',
      options: ['stacked', 'centered', 'side-by-side'],
    },
    width: {
      control: 'inline-radio',
      options: ['narrow', 'wide', 'full'],
    },
    textWidth: {
      control: 'inline-radio',
      options: ['narrow', 'wide'],
    },
    slotWidth: {
      control: 'inline-radio',
      options: ['narrow', 'wide', 'full'],
    },
    contentPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
    split: {
      control: 'inline-radio',
      options: ['50-50', '60-40', '40-60'],
    },
    reverseOnMobile: {
      control: 'boolean',
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

export const SideBySideContentLeft: Story = {
  args: {
    layout: 'side-by-side',
    contentPosition: 'left',
  },
};

export const SideBySideContentRight: Story = {
  args: {
    layout: 'side-by-side',
    contentPosition: 'right',
  },
};

export const SideBySideLeftWider: Story = {
  args: {
    layout: 'side-by-side',
    split: '60-40',
  },
};

export const SideBySideRightWider: Story = {
  args: {
    layout: 'side-by-side',
    split: '40-60',
  },
};
