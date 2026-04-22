import { Config } from '@puckeditor/core';

import { createMediaSelectorField } from '@/components/puck/editor/field-utils';
import { BodyCopyConfig } from '@/components/theme/atoms-content/body-copy/body-copy.config';
import { CallToActionConfig } from '@/components/theme/atoms-content/call-to-action/call-to-action.config';
import { HeadingConfig } from '@/components/theme/atoms-content/heading/heading.config';
import { ImageConfig } from '@/components/theme/atoms-content/image/image.config';
import { VideoConfig } from '@/components/theme/atoms-content/video/video.config';
import { ContainerConfig } from '@/components/theme/atoms-layout/container/container.config';
import { GridConfig } from '@/components/theme/atoms-layout/grid/grid.config';
import { SpaceConfig } from '@/components/theme/atoms-layout/space/space.config';
import { TwoColumnsConfig } from '@/components/theme/atoms-layout/two-columns/two-columns.config';
import { AccordionConfig } from '@/components/theme/organisms/accordion/accordion.config';
import { CardConfig } from '@/components/theme/organisms/card/card.config';
import { StatisticsConfig } from '@/components/theme/organisms/statistics/statistics.config';
import { TestimonialConfig } from '@/components/theme/organisms/testimonial/testimonial.config';
import { ContentSectionConfig } from '@/components/theme/sections/content-section/content-section.config';
import { HeroSectionConfig } from '@/components/theme/sections/hero-section/hero-section.config';

export const config: Config = {
  categories: {
    other: {
      visible: false,
    },
    sections: {
      visible: false,
      title: 'Sections',
      components: ['HeroSection', 'ContentSection'],
    },
    organisms: {
      visible: true,
      title: 'Organisms',
      components: ['Card', 'Accordion', 'Testimonial', 'Statistics'],
    },
    layout: {
      visible: true,
      title: 'Layout',
      components: ['Container', 'Grid', 'TwoColumns', 'Space'],
    },
    content: {
      visible: true,
      title: 'Content',
      components: ['Heading', 'BodyCopy', 'CallToAction', 'Image', 'Video'],
    },
  },
  components: {
    // Layout
    Container: ContainerConfig,
    Grid: GridConfig,
    TwoColumns: TwoColumnsConfig,
    Space: SpaceConfig,
    // Content
    Heading: HeadingConfig,
    BodyCopy: BodyCopyConfig,
    CallToAction: CallToActionConfig,
    Image: ImageConfig,
    Video: VideoConfig,
    // Organisms
    Card: CardConfig,
    Accordion: AccordionConfig,
    Testimonial: TestimonialConfig,
    Statistics: StatisticsConfig,
    // Sections
    HeroSection: HeroSectionConfig,
    ContentSection: ContentSectionConfig,
  },
  root: {
    fields: {
      publishedState: {
        type: 'select',
        label: 'Published State',
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Unpublished', value: 'unpublished' },
        ],
      },
      urlAlias: {
        type: 'text',
        label: 'URL Alias',
      },
      metadataTitle: {
        type: 'text',
        label: 'Metadata Title',
      },
      metadataDescription: {
        type: 'textarea',
        label: 'Metadata Description',
      },
      metadataImage: createMediaSelectorField({
        label: 'Metadata Image',
        mediaTypes: ['image'],
      }),
    },
  },
};

export default config;
