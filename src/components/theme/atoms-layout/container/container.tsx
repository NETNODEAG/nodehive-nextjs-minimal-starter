import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export interface ContainerProps extends VariantProps<typeof containerVariants> {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const containerVariants = cva('relative w-full', {
  variants: {
    width: {
      full: 'w-full',
      wide: 'container-wrapper',
      narrow: 'mx-auto w-full max-w-4xl px-4 md:px-8',
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
