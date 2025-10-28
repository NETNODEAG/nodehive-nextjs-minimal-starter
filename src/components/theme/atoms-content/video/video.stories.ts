import type { Meta, StoryObj } from '@storybook/react';

import Video from './video';

const meta = {
  title: 'Atoms Content/Video',
  component: Video,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    handleYoutubeShorts: {
      control: 'boolean',
    },
    options: {
      autoplay: 1,
      loop: 1,
      title: 0,
      byline: 0,
    },
  },
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YouTubeVideo: Story = {
  args: {
    src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    handleYoutubeShorts: false,
  },
};

export const YouTubeShorts: Story = {
  args: {
    src: 'https://youtube.com/shorts/gJBPHbk94mo?si=NpTKicnGJuS40yFa',
    handleYoutubeShorts: true,
  },
};

export const VimeoVideo: Story = {
  args: {
    src: 'https://player.vimeo.com/video/921046463',
  },
};

export const WithOptions: Story = {
  args: {
    src: 'https://player.vimeo.com/video/921046463',
    options: {
      autoplay: 1,
      loop: 1,
      title: 0,
      byline: 0,
    },
  },
};
