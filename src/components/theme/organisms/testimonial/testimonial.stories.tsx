import type { Meta, StoryObj } from '@storybook/react';

import Testimonial from './testimonial';

const meta = {
  title: 'Organisms/Testimonial',
  component: Testimonial,
  tags: ['autodocs'],
  args: {
    quote: 'A game-changer for how we ship content.',
    authorName: 'Jane Doe',
    authorRole: 'Head of Digital',
    authorCompany: 'Acme Corp',
  },
} satisfies Meta<typeof Testimonial>;

export default meta;

type Story = StoryObj<typeof Testimonial>;

export const Default: Story = {};
