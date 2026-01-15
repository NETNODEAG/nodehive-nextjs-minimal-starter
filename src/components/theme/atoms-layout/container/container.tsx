import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const containerVariants = cva('', {
  variants: {
    backgroundColor: {
      white: 'bg-white',
      black: 'bg-black',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      transparent: 'bg-transparent',
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
    },
  },
  defaultVariants: {
    backgroundColor: 'transparent',
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
} & VariantProps<typeof containerVariants> &
  VariantProps<typeof innerContainerVariants>;

export default function Container({
  children,
  width,
  backgroundColor,
  spacingY,
  spacingX,
  className,
  containerClassName,
  id,
}: ContainerProps) {
  return (
    <div
      id={id}
      className={cn(
        containerVariants({
          backgroundColor,
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
