import { ComponentConfig } from '@puckeditor/core';

import {
  createMediaSelectorField,
  createSectionBackgroundField,
} from '@/components/puck/editor/field-utils';
import HeroSection from '@/components/theme/sections/hero-section/hero-section';

export const HeroSectionConfig: ComponentConfig = {
  label: 'Hero',
  metadata: {
    ai: {
      description:
        'Large intro section with headline, subtitle, CTAs, and optional background media.',
      instructions:
        'At most once per page, as the first section. Title 3-8 words, description 10-25 words, max 2 CTAs.',
    },
  },
  fields: {
    layout: {
      type: 'select',
      label: 'Layout',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Centered', value: 'centered' },
        { label: 'Bottom', value: 'bottom' },
      ],
      metadata: {
        ai: {
          instructions:
            'default: left-aligned content. centered: content centered horizontally — elegant for short copy. bottom: content docked to the bottom — good when the background image is the main visual.',
        },
      },
    },
    height: {
      type: 'radio',
      label: 'Height',
      options: [
        { label: '25%', value: '25' },
        { label: '50%', value: '50' },
        { label: '90%', value: '90' },
      ],
      metadata: {
        ai: {
          instructions:
            '25: compact/subtle intro. 50: standard prominent hero. 90: near-full-viewport hero for landing pages.',
        },
      },
    },
    backgroundImage: createMediaSelectorField({
      label: 'Background Image',
      mediaTypes: ['image'],
    }),
    background: createSectionBackgroundField(['none', 'light', 'dark']),
    overlayOpacity: {
      type: 'select',
      label: 'Overlay Opacity',
      options: [
        { label: 'None', value: 0 },
        { label: 'Light (25%)', value: 25 },
        { label: 'Medium (50%)', value: 50 },
        { label: 'Heavy (75%)', value: 75 },
      ],
    },
    title: {
      type: 'text',
      label: 'Title',
      contentEditable: true,
    },
    description: {
      type: 'richtext',
      label: 'Text',
      contentEditable: true,
    },
    cta: {
      type: 'array',
      label: 'Call to Actions',
      max: 3,
      defaultItemProps: {
        text: 'Learn More',
        variant: 'button',
        size: 'big',
        target: '_self',
        href: '#',
      },
      arrayFields: {
        text: {
          type: 'text',
          label: 'Text',
        },
        variant: {
          type: 'select',
          label: 'Style',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Button', value: 'button' },
            { label: 'Button Outline', value: 'buttonOutline' },
          ],
        },
        size: {
          type: 'select',
          label: 'Size',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Big', value: 'big' },
          ],
        },
        target: {
          type: 'select',
          label: 'Target',
          options: [
            { label: 'Same Window', value: '_self' },
            { label: 'New Window', value: '_blank' },
          ],
        },
        href: {
          type: 'text',
          label: 'Link',
        },
      },
    },
  },
  resolveFields: (data, params) => {
    const f = params.fields;
    const hasBgImage = !!data.props.backgroundImage?.field_media_image;

    const fields: any = {
      layout: f.layout,
      height: f.height,
      backgroundImage: f.backgroundImage,
    };

    if (hasBgImage) {
      fields.overlayOpacity = f.overlayOpacity;
    } else {
      fields.background = f.background;
    }

    fields.title = f.title;
    fields.description = f.description;
    fields.cta = f.cta;

    return fields;
  },
  defaultProps: {
    title: 'Welcome to Our Platform',
    description:
      'Build amazing experiences with our powerful tools and intuitive design system.',
    layout: 'default',
    height: '50',
    background: 'none',
    overlayOpacity: 50,
    cta: [
      {
        text: 'Get Started',
        variant: 'button',
        size: 'big',
        target: '_self',
        href: '#',
      },
    ],
  },
  render: ({
    title,
    description,
    background,
    backgroundImage,
    overlayOpacity,
    layout,
    height,
    cta,
  }) => {
    const primaryCta = cta?.[0]?.text ? cta[0] : undefined;
    const secondaryCta = cta?.[1]?.text ? cta[1] : undefined;

    const imageAlt = backgroundImage?.field_media_image?.meta?.alt || '';
    const imageSrc =
      backgroundImage?.field_media_image?.image_style_uri?.wide ||
      backgroundImage?.field_media_image?.uri ||
      undefined;

    return (
      <HeroSection
        title={title}
        description={description}
        background={background}
        backgroundImage={
          imageSrc ? { src: imageSrc, alt: imageAlt } : undefined
        }
        overlayOpacity={overlayOpacity}
        layout={layout}
        height={height}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />
    );
  },
};
