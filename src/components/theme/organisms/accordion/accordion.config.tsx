import React from 'react';
import { ComponentConfig } from '@puckeditor/core';

import Accordion from '@/components/theme/organisms/accordion/accordion';

export const AccordionConfig: ComponentConfig = {
  label: 'Accordion',
  metadata: {
    ai: {
      description:
        'Collapsible accordion with a question/answer list. Each item has a question and a slot for the answer content (text, image, video).',
      instructions:
        'Use for FAQs, product specs, or any set of collapsible details. 4-8 items is typical. Keep questions conversational and answers short. Drop inside a ContentSection or Container to add an intro above. ALWAYS fill out the answer slot of every item — never leave it empty. At minimum nest a BodyCopy with 1-3 sentences answering the question; an Image (e.g. a product shot, diagram) is a great addition when it clarifies the answer. An accordion item without answer content is considered broken.',
    },
  },
  fields: {
    items: {
      type: 'array',
      label: 'Items',
      min: 1,
      max: 20,
      defaultItemProps: {
        question: 'New question',
        content: [
          {
            type: 'BodyCopy',
            props: {
              size: 'base',
              text: '<p>Write the answer to this question here.</p>',
            },
          },
        ],
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
          disallow: [
            'Container',
            'TwoColumns',
            'Grid',
            'Accordion',
            'HeroSection',
            'ContentSection',
          ],
          metadata: {
            ai: {
              instructions:
                'REQUIRED — never leave empty. Always nest at least one BodyCopy answering the question (1-3 sentences). Add an Image when a visual would clarify the answer.',
            },
          },
        },
      },
      getItemSummary: (item) => item.question || 'Question',
    },
  },
  defaultProps: {
    items: [
      {
        question: 'What is included in the plan?',
        content: [
          {
            type: 'BodyCopy',
            props: {
              size: 'base',
              text: '<p>Every plan includes core features, regular updates, and access to our full documentation. Higher tiers add SSO, audit logs, and priority support.</p>',
            },
          },
        ],
      },
      {
        question: 'Can I cancel anytime?',
        content: [
          {
            type: 'BodyCopy',
            props: {
              size: 'base',
              text: '<p>Yes. Cancel whenever you like from your account settings — no retention calls, no hidden fees.</p>',
            },
          },
        ],
      },
      {
        question: 'Do you offer a free trial?',
        content: [
          {
            type: 'BodyCopy',
            props: {
              size: 'base',
              text: '<p>We offer a 14-day free trial on every paid plan. No credit card required to get started.</p>',
            },
          },
        ],
      },
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
