import { ComponentConfig } from '@puckeditor/core';

import { createSectionBackgroundField } from '@/components/puck/editor/field-utils';
import Container from '@/components/theme/atoms-layout/container/container';

export const ContainerConfig: ComponentConfig = {
  label: 'Container',
  ai: {
    description:
      'Width-constrained wrapper that holds other components and controls max-width, padding, and vertical spacing.',
    instructions:
      'Wrap content blocks (Headings, BodyCopy, media) to keep readable line length and consistent page rhythm.',
  },
  fields: {
    content: {
      type: 'slot',
      disallow: ['Container', 'HeroSection', 'ContentSection'],
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
    background: createSectionBackgroundField([
      'none',
      'light',
      'dark',
      'primary',
    ]),
    spacingY: {
      label: 'Abstand vertikal',
      type: 'select',
      options: [
        { label: 'Kein', value: 'none' },
        { label: 'Klein', value: 'sm' },
        { label: 'Mittel', value: 'md' },
        { label: 'Gross', value: 'lg' },
        { label: 'Extra Gross', value: 'xl' },
        { label: 'Section (2xl)', value: '2xl' },
      ],
    },
    spacingX: {
      label: 'Abstand horizontal',
      type: 'select',
      options: [
        { label: 'Kein', value: 'none' },
        { label: 'Mittel', value: 'md' },
      ],
    },
  },
  defaultProps: {
    width: 'wide',
    background: 'none',
    spacingY: 'md',
    spacingX: 'md',
  },
  render: ({
    width,
    anchor,
    background,
    spacingY,
    spacingX,
    content: Content,
  }) => (
    <Container
      width={width}
      id={anchor}
      background={background}
      spacingY={spacingY}
      spacingX={spacingX}
    >
      <Content />
    </Container>
  ),
};
