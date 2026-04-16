import { ComponentConfig } from '@puckeditor/core';

import ContentSection from '@/components/theme/sections/content-section/content-section';

export const ContentSectionConfig: ComponentConfig = {
  label: 'Content Section',
  metadata: {
    aiDescription:
      'Full-width section with eyebrow, title, body, and an optional media slot (Image/Video/BodyCopy).',
    aiGuidelines:
      'Use when a standard titled content block with optional media is needed.',
  },
  fields: {
    layout: {
      type: 'select',
      label: 'Layout',
      options: [
        { label: 'Stacked', value: 'stacked' },
        { label: 'Centered', value: 'centered' },
        { label: 'Content Left / Media Right', value: 'content-left' },
        { label: 'Media Left / Content Right', value: 'media-left' },
      ],
      metadata: {
        aiGuidelines:
          'stacked: text then media below. centered: centered text only. content-left/media-left: pick based on which side should lead visually.',
      },
    },
    variant: {
      type: 'radio',
      label: 'Variant',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
    },
    background: {
      type: 'select',
      label: 'Background',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Light', value: 'light' },
      ],
      metadata: {
        aiGuidelines:
          'none: default transparent. light: use to break visual rhythm between adjacent sections.',
      },
    },
    eyebrow: {
      type: 'text',
      label: 'Eyebrow',
      contentEditable: true,
    },
    title: {
      type: 'text',
      label: 'Title',
      contentEditable: true,
    },
    body: {
      type: 'richtext',
      label: 'Text',
      contentEditable: true,
    },
    content: {
      type: 'slot',
      label: 'Content',
      allow: ['Image', 'Video', 'BodyCopy'],
    },
  },
  defaultProps: {
    title: 'Content Section Title',
    eyebrow: 'Eyebrow',
    body: '<p>Add your content here.</p>',
    background: 'none',
    layout: 'stacked',
    variant: '1',
  },
  render: ({
    title,
    eyebrow,
    body,
    background,
    layout,
    variant,
    content: Content,
  }) => {
    return (
      <ContentSection
        title={title}
        eyebrow={eyebrow}
        body={body}
        background={background}
        layout={layout}
        variant={variant}
        content={Content}
      />
    );
  },
};
