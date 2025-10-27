import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const headingVariants = cva('hyphens-auto lg:hyphens-none font-heading', {
  variants: {
    size: {
      'display-xxl':
        'text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight',
      'display-xl': 'text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight',
      xl: 'text-4xl md:text-5xl font-bold',
      lg: 'text-3xl md:text-4xl font-bold',
      md: 'text-xl md:text-2xl font-bold',
      sm: 'text-lg md:text-xl font-bold',
    },
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  level: '1' | '2' | '3' | '4';
}

const Heading: React.FC<HeadingProps> = ({
  level,
  size,
  className,
  children,
  ...props
}) => {
  const Tag: keyof React.JSX.IntrinsicElements = `h${level}`;

  return (
    <Tag className={cn(headingVariants({ size }), className)} {...props}>
      {children}
    </Tag>
  );
};

export { Heading, headingVariants };

export const H1: React.FC<Omit<HeadingProps, 'level'>> = ({
  size = 'xl',
  ...props
}) => <Heading level="1" size={size} {...props} />;

export const H2: React.FC<Omit<HeadingProps, 'level'>> = ({
  size = 'lg',
  ...props
}) => <Heading level="2" size={size} {...props} />;

export const H3: React.FC<Omit<HeadingProps, 'level'>> = ({
  size = 'md',
  ...props
}) => <Heading level="3" size={size} {...props} />;

export const H4: React.FC<Omit<HeadingProps, 'level'>> = ({
  size = 'sm',
  ...props
}) => <Heading level="4" size={size} {...props} />;
