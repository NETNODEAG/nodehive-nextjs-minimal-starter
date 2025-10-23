import { ComponentConfig } from '@measured/puck';

import Section from '@/components/theme/atoms-layout/container/container';

export const ContainerConfig: ComponentConfig = {
  label: 'Container',
  fields: {
    content: {
      type: 'slot',
    },
    anchor: {
      type: 'text',
      label: 'Anker',
    },
    width: {
      label: 'Breite',
      type: 'select',
      options: [
        { label: 'Volle Breite', value: 'full' },
        { label: 'Wide', value: 'wide' },
        { label: 'Narrow', value: 'narrow' },
      ],
    },
  },
  defaultProps: {
    width: 'wide',
    backgroundColor: 'transparent',
  },
  render: ({ width, anchor, content: Content, backgroundColor }) => (
    <div className="py-8 md:py-16">
      <Section width={width} id={anchor}>
        <Content />
      </Section>
    </div>
  ),
};
