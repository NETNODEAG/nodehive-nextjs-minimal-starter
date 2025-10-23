import { ReactNode } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const callToActionVariants = cva(
  'inline-flex items-center justify-center gap-2 text-center font-medium no-underline transition-all duration-200 ease-in-out',
  {
    variants: {
      variant: {
        link: 'text-primary hover:text-primary/80 underline hover:no-underline',
        button:
          'border border-transparent bg-primary text-white hover:bg-primary/80 rounded-full',
        buttonOutline:
          'border border-primary text-primary bg-white hover:bg-slate-50 rounded-full',
      },
      size: {
        small: 'text-sm px-3 py-1.5',
        big: 'text-lg px-5 py-2.5',
      },
    },
    defaultVariants: {
      variant: 'link',
      size: 'small',
    },
  }
);

export interface CallToActionProps
  extends NextLinkProps,
    VariantProps<typeof callToActionVariants> {
  children: ReactNode;
  className?: string;
  text?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  target?: string;
}

export default function CallToAction({
  children,
  className,
  variant,
  size,
  text,
  icon,
  iconPosition = 'right',
  target = '_self',
  href, // The href prop is used directly
  ...props
}: CallToActionProps) {
  const content = text || children;
  const iconSize =
    size === 'big' ? '[&>svg]:w-5 [&>svg]:h-5' : '[&>svg]:w-4 [&>svg]:h-4';

  return (
    <NextLink
      href={href}
      className={cn(
        callToActionVariants({ variant, size }),
        variant === 'link' && 'px-0 py-0',
        className
      )}
      target={target === '_blank' ? '_blank' : '_self'}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={cn('flex-shrink-0', iconSize)}>{icon}</span>
      )}
      <span>{content}</span>
      {icon && iconPosition === 'right' && (
        <span className={cn('flex-shrink-0', iconSize)}>{icon}</span>
      )}
    </NextLink>
  );
}
