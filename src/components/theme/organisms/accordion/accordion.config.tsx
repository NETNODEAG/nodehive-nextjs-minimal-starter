import React from 'react';
import { ComponentConfig } from '@puckeditor/core';

import Accordion from '@/components/theme/organisms/accordion/accordion';

export const AccordionConfig: ComponentConfig = {
  label: 'Accordion',
  ai: {
    description:
      'Collapsible accordion with a question/answer list. Each item has a question and a slot for the answer content (text, image, video).',
    instructions:
      'Use for FAQs, product specs, or any set of collapsible details. 4-8 items is typical. Keep questions conversational and answers short. Drop inside a ContentSection or Container to add an intro above.',
  },
  fields: {
    items: {
      type: 'array',
      label: 'Items',
      min: 1,
      max: 20,
      defaultItemProps: {
        question: 'New question',
        content: [],
      },
      arrayFields: {
        question: {
          type: 'text',
          label: 'Question',
          contentEditable: true,
        },
        content: {
          type: 'slot',
          label: 'Answer',
          allow: [
            'Heading',
            'BodyCopy',
            'CallToAction',
            'Image',
            'Video',
            'Space',
          ],
        },
      },
      getItemSummary: (item) => item.question || 'Question',
    },
  },
  defaultProps: {
    items: [
      { question: 'What is included in the plan?', content: [] },
      { question: 'Can I cancel anytime?', content: [] },
      { question: 'Do you offer a free trial?', content: [] },
    ],
  },
  render: ({ items, puck }) => (
    <Accordion
      items={items?.map((item: { question: string; content?: React.FC }) => ({
        question: item.question,
        content: item.content ? <item.content /> : null,
      }))}
      isEditing={puck?.isEditing}
    />
  ),
};
