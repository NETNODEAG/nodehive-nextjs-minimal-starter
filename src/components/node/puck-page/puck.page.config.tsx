import { Config } from '@measured/puck';

import { BodyCopyConfig } from '@/components/theme/atoms-content/body-copy/body-copy.config';
import { CallToActionConfig } from '@/components/theme/atoms-content/call-to-action/call-to-action.config';
import { HeadingConfig } from '@/components/theme/atoms-content/heading/heading.config';
import { ContainerConfig } from '@/components/theme/atoms-layout/container/container.config';
import { GridConfig } from '@/components/theme/atoms-layout/grid/grid.config';
import { SpaceConfig } from '@/components/theme/atoms-layout/space/space.config';
import { TwoColumnsConfig } from '@/components/theme/atoms-layout/two-columns/two-columns.config';
import { CardConfig } from '@/components/theme/organisms/card/card.config';
import { StatisticsConfig } from '@/components/theme/organisms/statistics/statistics.config';
import { HeroConfig } from '@/components/theme/sections/hero/hero.config';
import { TwoColumnContentConfig } from '@/components/theme/sections/two-column-content/two-column-content.config';

export const config: Config = {
  categories: {
    other: {
      visible: false,
    },
    sections: {
      visible: true,
      title: 'Sections',
      components: ['Hero', 'TwoColumnContent'],
    },
    layout: {
      visible: true,
      title: 'Layout',
      components: ['Container', 'Grid', 'TwoColumns', 'Space'],
    },
    components: {
      visible: true,
      title: 'Komponenten',
      components: ['Heading', 'BodyCopy', 'CallToAction'],
    },
    organisms: {
      visible: true,
      title: 'Organisms',
      components: ['Card', 'Statistics'],
    },
    templates: {
      visible: false,
      title: 'Templates',
      components: [],
    },
  },
  components: {
    // Layout
    Container: ContainerConfig,
    Grid: GridConfig,
    TwoColumns: TwoColumnsConfig,
    Space: SpaceConfig,
    // Components
    Heading: HeadingConfig,
    BodyCopy: BodyCopyConfig,
    CallToAction: CallToActionConfig,
    // Organisms
    Card: CardConfig,
    Statistics: StatisticsConfig,
    // Sections
    Hero: HeroConfig,
    TwoColumnContent: TwoColumnContentConfig,
  },
  root: {
    fields: {},
  },
};

export default config;
