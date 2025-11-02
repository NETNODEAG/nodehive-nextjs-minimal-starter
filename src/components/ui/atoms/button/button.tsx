'use client';

import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center px-3 py-1.5 text-sm font-bold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary hover:bg-primary/90 focus-visible:ring-primary rounded-full border text-white',
        secondary:
          'bg-secondary border-secondary hover:bg-secondary/90 focus-visible:ring-secondary rounded-full border text-white',
        outline:
          'border-primary text-primary hover:bg-primary/10 focus-visible:ring-primary rounded-full border bg-white',
        ghost:
          'rounded-full hover:bg-slate-100 hover:text-black focus-visible:ring-slate-100',
      },
    },
    defaultVariants: { variant: 'primary' },
  }
);

export interface ButtonProps
  extends VariantProps<typeof buttonVariants>,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  text,
  children,
  variant,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      {text}
      {children}
    </button>
  );
}
