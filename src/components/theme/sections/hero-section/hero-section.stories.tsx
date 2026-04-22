import type { Meta, StoryObj } from '@storybook/react';

import HeroSection from './hero-section';

const backgroundOptions = ['none', 'light'] as const;

const meta = {
  title: 'Sections/Hero',
  component: HeroSection,
  tags: ['autodocs'],
  args: {
    background: 'none',
    title: 'Craft standout digital experiences',
    description:
      '<p>Bring your marketing and editorial teams together with a component library that stays consistent across every touchpoint.</p>',
    primaryCta: {
      text: 'Get started',
      href: '/',
      variant: 'button',
      size: 'big',
    },
    secondaryCta: {
      text: 'View documentation',
      href: '/',
      variant: 'buttonOutline',
      size: 'big',
    },
  },
  argTypes: {
    background: {
      control: 'inline-radio',
      options: backgroundOptions,
    },
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof HeroSection>;

export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {};

export const Backgrounds: Story = {
  render: (args) => (
    <div className="space-y-12">
      {backgroundOptions.map((background) => (
        <HeroSection key={background} {...args} background={background} />
      ))}
    </div>
  ),
};
