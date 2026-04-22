import { ComponentConfig } from '@puckeditor/core';

import { Heading } from '@/components/theme/atoms-content/heading/heading';

export const HeadingConfig: ComponentConfig = {
  label: 'Heading',
  ai: {
    description: 'Page or section heading (h1-h4).',
    instructions: 'Keep headings concise (3-8 words).',
  },
  fields: {
    text: {
      type: 'text',
      label: 'Text',
    },
    size: {
      type: 'select',
      label: 'Grösse',
      options: [
        { label: 'Display XXL', value: 'display-xxl' },
        { label: 'Display XL', value: 'display-xl' },
        { label: 'Extra Large', value: 'xl' },
        { label: 'Large', value: 'lg' },
        { label: 'Medium', value: 'md' },
        { label: 'Small', value: 'sm' },
      ],
      metadata: {
        ai: {
          instructions:
            'Visual size, independent of semantic level. display-xxl/xl for hero-style titles, xl/lg for major section headings, md/sm for sub-sections.',
        },
      },
    },
    level: {
      type: 'select',
      label: 'Level',
      options: [
        { label: 'H1', value: '1' },
        { label: 'H2', value: '2' },
        { label: 'H3', value: '3' },
        { label: 'H4', value: '4' },
      ],
      metadata: {
        ai: {
          instructions:
            'Semantic HTML level. One "1" (h1) per page. "2" for page sections, "3"-"4" for subsections.',
        },
      },
    },
  },
  defaultProps: {
    text: 'Section heading',
    size: 'lg',
    level: '2',
  },
  render: ({ text, level, size }) => {
    return (
      <Heading level={level} size={size}>
        {text}
      </Heading>
    );
  },
};
