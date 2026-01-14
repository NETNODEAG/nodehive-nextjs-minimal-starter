import { SlotComponent } from '@puckeditor/core';

import { cn } from '@/lib/utils';

export type GridProps = {
  columns?: number;
  gap?: string;
  content: SlotComponent;
};

const columnClasses = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
} as const;

const gapClasses = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
} as const;

export default function Grid({
  columns = 2,
  gap = 'md',
  content: ContentSlot,
}: GridProps) {
  return (
    <ContentSlot
      className={cn(
        'grid grid-cols-1',
        columnClasses[columns as keyof typeof columnClasses],
        gapClasses[gap as keyof typeof gapClasses]
      )}
    />
  );
}
