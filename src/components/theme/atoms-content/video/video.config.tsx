import { ComponentConfig } from '@puckeditor/core';

import { createMediaSelectorField } from '@/components/puck/editor/field-utils';
import Video from '@/components/theme/atoms-content/video/video';

export const VideoConfig: ComponentConfig = {
  label: 'Video',
  metadata: {
    ai: {
      description:
        'Embedded video picked from the Drupal media library or a remote source.',
      instructions:
        'Prefer muted autoplay for decorative videos to respect browser autoplay policies.',
    },
  },
  fields: {
    videoSelector: createMediaSelectorField({
      label: 'Video auswählen',
      mediaTypes: ['remote_video'],
    }),
    videoUrl: {
      type: 'text',
      label: 'Video URL',
    },
  },
  defaultProps: {
    videoUrl: 'https://www.youtube.com/watch?v=Sa6fZzXvYgw',
  },
  resolveData(data, params) {
    const { props } = data;
    if (!params.changed?.videoSelector) return { props };
    if (!props.videoSelector) return { props };
    return {
      props: {
        ...props,
        videoUrl: props.videoSelector?.field_media_oembed_video,
      },
    };
  },
  render: ({ videoUrl }) => {
    return <Video src={videoUrl} />;
  },
};
