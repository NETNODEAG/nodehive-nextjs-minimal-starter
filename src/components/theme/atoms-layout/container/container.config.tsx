import { ComponentConfig } from '@puckeditor/core';

import Container from '@/components/theme/atoms-layout/container/container';

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
    backgroundColor: {
      label: 'Hintergrundfarbe',
      type: 'select',
      options: [
        { label: 'Transparent', value: 'transparent' },
        { label: 'Weiss', value: 'white' },
        { label: 'Schwarz', value: 'black' },
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
      ],
    },
    spacingY: {
      label: 'Abstand vertikal',
      type: 'select',
      options: [
        { label: 'Kein', value: 'none' },
        { label: 'Klein', value: 'sm' },
        { label: 'Mittel', value: 'md' },
        { label: 'Gross', value: 'lg' },
        { label: 'Extra Gross', value: 'xl' },
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
    backgroundColor: 'transparent',
    spacingY: 'md',
    spacingX: 'md',
  },
  render: ({
    width,
    anchor,
    backgroundColor,
    spacingY,
    spacingX,
    content: Content,
  }) => (
    <Container
      width={width}
      id={anchor}
      backgroundColor={backgroundColor}
      spacingY={spacingY}
      spacingX={spacingX}
    >
      <Content />
    </Container>
  ),
};
