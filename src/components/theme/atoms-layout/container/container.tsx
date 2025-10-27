import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export interface ContainerProps extends VariantProps<typeof containerVariants> {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const containerVariants = cva('relative w-full px-4 md:px-8', {
  variants: {
    width: {
      full: '',
      wide: 'mx-auto max-w-7xl',
      narrow: 'mx-auto max-w-4xl',
    },
  },
  defaultVariants: {
    width: 'wide',
  },
});

export default function Container({
  children,
  className,
  id,
  width,
  ...props
}: ContainerProps) {
  return (
    <section
      {...props}
      id={id}
      className={cn(containerVariants({ width }), className)}
    >
      {children}
    </section>
  );
}
