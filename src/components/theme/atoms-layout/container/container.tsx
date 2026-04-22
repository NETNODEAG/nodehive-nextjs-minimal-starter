import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import type { SectionBackgroundVariant } from '@/components/puck/editor/field-utils';

const containerVariants = cva('', {
  variants: {
    background: {
      none: 'bg-transparent',
      light: 'bg-background text-foreground',
      dark: 'bg-background text-foreground',
      primary: 'bg-background text-foreground',
    },
    spacingX: {
      none: 'px-0',
      md: 'px-4 md:px-8',
    },
    spacingY: {
      none: 'py-0',
      sm: 'py-2 md:py-4',
      md: 'py-4 md:py-8',
      lg: 'py-6 md:py-12',
      xl: 'py-8 md:py-16',
      '2xl': 'py-12 md:py-20 lg:py-24',
    },
  },
  defaultVariants: {
    background: 'none',
    spacingY: 'md',
    spacingX: 'md',
  },
});

const innerContainerVariants = cva('mx-auto', {
  variants: {
    width: {
      narrow: 'max-w-4xl',
      wide: 'max-w-7xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    width: 'wide',
  },
});

export type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  background?: SectionBackgroundVariant;
} & Omit<VariantProps<typeof containerVariants>, 'background'> &
  VariantProps<typeof innerContainerVariants>;

export default function Container({
  children,
  width,
  background = 'none',
  spacingY,
  spacingX,
  className,
  containerClassName,
  id,
}: ContainerProps) {
  return (
    <div
      id={id}
      data-section-theme={background !== 'none' ? background : undefined}
      className={cn(
        containerVariants({
          background,
          spacingY,
          spacingX,
        }),
        containerClassName
      )}
    >
      <div className={cn(innerContainerVariants({ width }), className)}>
        {children}
      </div>
    </div>
  );
}
