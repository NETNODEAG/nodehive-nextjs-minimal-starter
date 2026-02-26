import { ComponentConfig } from '@puckeditor/core';

import ContentSection from '@/components/theme/sections/content-section/content-section';

export const ContentSectionConfig: ComponentConfig = {
  label: 'Content Section',
  fields: {
    align: {
      type: 'select',
      label: 'Layout',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    background: {
      type: 'select',
      label: 'Background',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    title: {
      type: 'text',
      label: 'Title',
      contentEditable: true,
    },
    eyebrow: {
      type: 'text',
      label: 'Eyebrow',
      contentEditable: true,
    },
    body: {
      type: 'richtext',
      label: 'Body',
      contentEditable: true,
    },
  },
  defaultProps: {
    title: 'Content Section Title',
    eyebrow: 'Eyebrow',
    body: '<p>Add your content here.</p>',
    background: 'none',
    align: 'left',
  },
  render: ({ title, eyebrow, body, background, align }) => {
    return (
      <ContentSection
        title={title}
        eyebrow={eyebrow}
        body={body}
        background={background}
        align={align}
      />
    );
  },
};
