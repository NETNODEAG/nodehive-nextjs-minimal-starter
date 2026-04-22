import { ComponentConfig } from '@puckeditor/core';

import TwoColumnsLayout, {
  TwoColumnsConfigProps,
} from '@/components/theme/atoms-layout/two-columns/two-columns';

// Column ratio options for two-column layouts
const columnRatioOptions = [
  { label: '1:1 (50% / 50%)', value: '1:1' },
  { label: '1:2 (33% / 67%)', value: '1:2' },
  { label: '2:1 (67% / 33%)', value: '2:1' },
  { label: '1:3 (25% / 75%)', value: '1:3' },
  { label: '3:1 (75% / 25%)', value: '3:1' },
  { label: '2:3 (40% / 60%)', value: '2:3' },
  { label: '3:2 (60% / 40%)', value: '3:2' },
];

// Gap size options (matching grid config)
const gapOptions = [
  { label: 'None', value: 'none' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl' },
  { label: '2X Large', value: '2xl' },
  { label: '3X Large', value: '3xl' },
];

export const TwoColumnsConfig: ComponentConfig<TwoColumnsConfigProps> = {
  label: 'Zwei Spalten',
  ai: {
    description: 'Two-column side-by-side layout with configurable ratio.',
    instructions:
      "Only used inside section slots for custom two-column layouts — never at the page root. For typical side-by-side text-plus-media use a ContentSection with a side-by-side layout instead; TwoColumns is the escape hatch when the section-level layouts don't fit.",
  },
  fields: {
    columnRatio: {
      label: 'Spalten-Verhältnis',
      type: 'select',
      options: columnRatioOptions,
      metadata: {
        ai: {
          instructions:
            '1:1 for balanced content, 1:2 or 2:1 when one side dominates.',
        },
      },
    },
    gap: {
      label: 'Abstand zwischen Spalten',
      type: 'select',
      options: gapOptions,
    },
    reverseOrder: {
      label: 'Reihenfolge auf Mobil umkehren',
      type: 'select',
      options: [
        { label: 'Nein', value: false },
        { label: 'Ja', value: true },
      ],
    },
    leftColumn: {
      type: 'slot',
      label: 'Linke Spalte',
      disallow: ['Container', 'TwoColumns', 'HeroSection', 'ContentSection'],
    },
    rightColumn: {
      type: 'slot',
      label: 'Rechte Spalte',
      disallow: ['Container', 'TwoColumns', 'HeroSection', 'ContentSection'],
    },
  },

  defaultProps: {
    columnRatio: '1:1',
    gap: 'md',
    reverseOrder: false,
  },

  render: (props: TwoColumnsConfigProps) => <TwoColumnsLayout {...props} />,
};
