'use client';

import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center whitespace-nowrap font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white rounded-full hover:bg-primary/90',
        secondary:
          'bg-white text-primary border border-primary rounded-full hover:bg-primary/10',
        outline:
          'border border-primary text-primary bg-white hover:bg-slate-50',
        ghost: 'hover:bg-gray-50 hover:text-black',
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
