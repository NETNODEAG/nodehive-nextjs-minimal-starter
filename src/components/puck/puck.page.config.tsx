import { Config } from '@measured/puck';

import { BodyCopyConfig } from '@/components/ui/content/body-copy/body-copy.config';
import { CallToActionConfig } from '@/components/ui/content/call-to-action/call-to-action.config';
import { HeadingConfig } from '@/components/ui/content/heading/heading.config';
import { ContainerConfig } from '@/components/ui/layout/container/container.config';
import { GridConfig } from '@/components/ui/layout/grid/grid.config';
import { SpaceConfig } from '@/components/ui/layout/space/space.config';
import { TwoColumnsConfig } from '@/components/ui/layout/two-columns/two-columns.config';

export const config: Config = {
  categories: {
    other: {
      visible: false,
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
    // Sections
  },
  root: {
    fields: {},
  },
};

export default config;
