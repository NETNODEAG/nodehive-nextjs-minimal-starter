import { ComponentConfig } from '@puckeditor/core';

import { createSectionBackgroundField } from '@/components/puck/editor/field-utils';
import ContentSection from '@/components/theme/sections/content-section/content-section';

export const ContentSectionConfig: ComponentConfig = {
  label: 'Content',
  ai: {
    description:
      'Full-width section with eyebrow, title, body, and an optional media slot (Image or Video only).',
    instructions:
      'Use when a standard titled content block with optional media is needed.',
  },
  fields: {
    layout: {
      type: 'select',
      label: 'Layout',
      options: [
        { label: 'Stacked', value: 'stacked' },
        { label: 'Centered', value: 'centered' },
        { label: 'Side by Side', value: 'side-by-side' },
      ],
      metadata: {
        ai: {
          instructions:
            'stacked: text then media below. centered: centered text, media below. side-by-side: text and media in adjacent columns.',
        },
      },
    },
    width: {
      type: 'select',
      label: 'Width',
      options: [
        { label: 'Narrow', value: 'narrow' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full', value: 'full' },
      ],
      metadata: {
        ai: {
          instructions:
            'Only for side-by-side. Outer container width. narrow=896px, wide=1280px, full=viewport width minus gutter.',
        },
      },
    },
    textWidth: {
      type: 'select',
      label: 'Title Width',
      options: [
        { label: 'Narrow', value: 'narrow' },
        { label: 'Wide', value: 'wide' },
      ],
      metadata: {
        ai: {
          instructions:
            'Only for stacked/centered. Max width of the text block (eyebrow/title/body). narrow=896px (good reading length), wide=1280px.',
        },
      },
    },
    slotWidth: {
      type: 'select',
      label: 'Content Width',
      options: [
        { label: 'Narrow', value: 'narrow' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full', value: 'full' },
      ],
      metadata: {
        ai: {
          instructions:
            'Only for stacked/centered. Max width of the Content slot (Image/Video/BodyCopy drop area). narrow=896px, wide=1280px, full=viewport width.',
        },
      },
    },
    contentPosition: {
      type: 'radio',
      label: 'Content Position',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      metadata: {
        ai: {
          instructions:
            'Only for side-by-side. Which side the Content slot (the drop area holding Image/Video/BodyCopy) is on (desktop). The text column (eyebrow/title/body) fills the other side.',
        },
      },
    },
    split: {
      type: 'select',
      label: 'Split (left / right)',
      options: [
        { label: '50 / 50', value: '50-50' },
        { label: '60 / 40', value: '60-40' },
        { label: '40 / 60', value: '40-60' },
      ],
      metadata: {
        ai: {
          instructions:
            'Only for side-by-side. Column proportions as left/right percentages (desktop). 50-50 balanced, 60-40 left column wider, 40-60 right column wider. Combine with contentPosition to decide whether the Content slot or the text column gets the wider side.',
        },
      },
    },
    reverseOnMobile: {
      type: 'radio',
      label: 'Reverse order on mobile',
      options: [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
      ],
      metadata: {
        ai: {
          instructions:
            'Only for side-by-side. On mobile the two columns stack. By default they follow desktop order (e.g. Content slot on the left shows the slot first, text below). Enable to flip that on mobile.',
        },
      },
    },
    background: createSectionBackgroundField(['none', 'light']),
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
      disallow: ['Container', 'HeroSection', 'ContentSection'],
    },
  },
  resolveFields: (data, params) => {
    const f = params.fields;
    const isSideBySide = data.props.layout === 'side-by-side';

    const fields: any = {
      layout: f.layout,
    };

    if (isSideBySide) {
      fields.width = f.width;
      fields.contentPosition = f.contentPosition;
      fields.split = f.split;
      fields.reverseOnMobile = f.reverseOnMobile;
    } else {
      fields.textWidth = f.textWidth;
      fields.slotWidth = f.slotWidth;
    }

    fields.background = f.background;
    fields.eyebrow = f.eyebrow;
    fields.title = f.title;
    fields.body = f.body;
    fields.content = f.content;

    return fields;
  },
  defaultProps: {
    title: 'Everything you need to ship faster',
    eyebrow: 'FEATURES',
    body: '<p>A short intro paragraph sets context for what follows. Keep it concrete and focused on the reader.</p>',
    background: 'none',
    layout: 'stacked',
    width: 'wide',
    textWidth: 'narrow',
    slotWidth: 'wide',
    contentPosition: 'left',
    split: '50-50',
    reverseOnMobile: false,
  },
  render: ({
    title,
    eyebrow,
    body,
    background,
    layout,
    width,
    textWidth,
    slotWidth,
    contentPosition,
    split,
    reverseOnMobile,
    content: Content,
  }) => {
    return (
      <ContentSection
        title={title}
        eyebrow={eyebrow}
        body={body}
        background={background}
        layout={layout}
        width={width}
        textWidth={textWidth}
        slotWidth={slotWidth}
        contentPosition={contentPosition}
        split={split}
        reverseOnMobile={reverseOnMobile}
        content={Content}
      />
    );
  },
};
