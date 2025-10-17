import { ComponentConfig } from '@measured/puck';

import { cn } from '@/lib/utils';

export type TwoColumnsConfigProps = {
  columnRatio?: string;
  gap?: string;
  reverseOrder?: boolean;
  leftColumn?: any;
  rightColumn?: any;
};

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

// Map ratio to grid column classes
const ratioToGridClasses = {
  '1:1': 'md:grid-cols-2',
  '1:2': 'md:grid-cols-3',
  '2:1': 'md:grid-cols-3',
  '1:3': 'md:grid-cols-4',
  '3:1': 'md:grid-cols-4',
  '2:3': 'md:grid-cols-5',
  '3:2': 'md:grid-cols-5',
} as const;

// Map ratio to individual column span classes
const ratioToColumnSpans = {
  '1:1': { left: 'md:col-span-1', right: 'md:col-span-1' },
  '1:2': { left: 'md:col-span-1', right: 'md:col-span-2' },
  '2:1': { left: 'md:col-span-2', right: 'md:col-span-1' },
  '1:3': { left: 'md:col-span-1', right: 'md:col-span-3' },
  '3:1': { left: 'md:col-span-3', right: 'md:col-span-1' },
  '2:3': { left: 'md:col-span-2', right: 'md:col-span-3' },
  '3:2': { left: 'md:col-span-3', right: 'md:col-span-2' },
} as const;

// Map gap to classes (matching grid config)
const gapToClasses = {
  none: 'gap-0',
  sm: 'gap-1 md:gap-2',
  md: 'gap-2 md:gap-4',
  lg: 'gap-4 md:gap-6',
  xl: 'gap-6 md:gap-10',
  '2xl': 'gap-10 md:gap-20',
  '3xl': 'gap-20 md:gap-40',
} as const;

function TwoColumnsLayout({
  columnRatio = '1:1',
  gap = 'md',
  reverseOrder = false,
  leftColumn: LeftColumn,
  rightColumn: RightColumn,
}: TwoColumnsConfigProps) {
  const gridClass =
    ratioToGridClasses[columnRatio as keyof typeof ratioToGridClasses];
  const columnSpans =
    ratioToColumnSpans[columnRatio as keyof typeof ratioToColumnSpans];
  const gapClass = gapToClasses[gap as keyof typeof gapToClasses];

  return (
    <div className={cn('grid grid-cols-1', gridClass, gapClass)}>
      <div
        className={cn(
          columnSpans.left,
          reverseOrder ? 'order-2 md:order-1' : 'order-1'
        )}
      >
        {LeftColumn && <LeftColumn />}
      </div>
      <div
        className={cn(
          columnSpans.right,
          reverseOrder ? 'order-1 md:order-2' : 'order-2'
        )}
      >
        {RightColumn && <RightColumn />}
      </div>
    </div>
  );
}

export const TwoColumnsConfig: ComponentConfig<TwoColumnsConfigProps> = {
  label: 'Zwei Spalten',
  fields: {
    columnRatio: {
      label: 'Spalten-Verhältnis',
      type: 'select',
      options: columnRatioOptions,
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
    },
    rightColumn: {
      type: 'slot',
      label: 'Rechte Spalte',
    },
  },

  defaultProps: {
    columnRatio: '1:1',
    gap: 'md',
    reverseOrder: false,
  },

  render: (props: TwoColumnsConfigProps) => <TwoColumnsLayout {...props} />,
};
