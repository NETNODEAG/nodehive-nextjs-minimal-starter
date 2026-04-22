import { ComponentConfig } from '@puckeditor/core';

import { createMediaSelectorField } from '@/components/puck/editor/field-utils';
import Testimonial from '@/components/theme/organisms/testimonial/testimonial';

export const TestimonialConfig: ComponentConfig = {
  label: 'Testimonial',
  ai: {
    description:
      'Single hero testimonial: large centered quote with optional author details and avatar.',
    instructions:
      'Use to build trust with one standout quote. Keep it short (1-3 sentences). Always include a name; role and company optional. Use an avatar only if you actually have one — never a generic stock photo.',
  },
  fields: {
    quote: {
      type: 'textarea',
      label: 'Quote',
      contentEditable: true,
    },
    authorName: { type: 'text', label: 'Author name' },
    authorRole: { type: 'text', label: 'Author role' },
    authorCompany: { type: 'text', label: 'Author company' },
    avatar: createMediaSelectorField({
      label: 'Avatar',
      mediaTypes: ['image'],
    }),
  },
  defaultProps: {
    quote: 'A game-changer for how we ship content.',
    authorName: 'Jane Doe',
    authorRole: 'Head of Digital',
    authorCompany: 'Acme Corp',
  },
  render: ({ quote, authorName, authorRole, authorCompany, avatar }) => {
    const avatarSrc = avatar?.field_media_image?.uri?.url
      ? {
          src: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || ''}${avatar.field_media_image.uri.url}`,
          alt: avatar.field_media_image?.meta?.alt || '',
        }
      : undefined;

    return (
      <Testimonial
        quote={quote}
        authorName={authorName}
        authorRole={authorRole}
        authorCompany={authorCompany}
        avatar={avatarSrc}
      />
    );
  },
};
