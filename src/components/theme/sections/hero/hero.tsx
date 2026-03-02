import React from 'react';
import NextImage from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';
import CallToAction from '@/components/theme/atoms-content/call-to-action/call-to-action';
import { Heading } from '@/components/theme/atoms-content/heading/heading';
import Container from '../../atoms-layout/container/container';

const heroVariants = cva('w-full text-left', {
  variants: {
    background: {
      none: 'bg-transparent',
      light: 'bg-gray-50',
    },
  },
  defaultVariants: {
    background: 'none',
  },
});

export type HeroLayout = 'default' | 'centered' | 'bottom';
export type HeroHeight = '25' | '50' | '90';

export interface HeroProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'title'>,
    VariantProps<typeof heroVariants> {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  layout?: HeroLayout;
  height?: HeroHeight;
  backgroundImage?: {
    src: string;
    alt?: string;
  };
  overlayOpacity?: number;
  primaryCta?: {
    text: string;
    href: string;
    variant?: 'link' | 'button' | 'buttonOutline';
    size?: 'small' | 'big';
    target?: '_self' | '_blank';
  };
  secondaryCta?: {
    text: string;
    href: string;
    variant?: 'link' | 'button' | 'buttonOutline';
    size?: 'small' | 'big';
    target?: '_self' | '_blank';
  };
}

const Hero: React.FC<HeroProps> = ({
  title,
  description,
  primaryCta,
  secondaryCta,
  background,
  backgroundImage,
  overlayOpacity = 50,
  layout = 'default',
  height = '50',
  className,
  ...props
}) => {
  const isCentered = layout === 'centered';
  const isBottom = layout === 'bottom';
  const hasBackgroundImage = !!backgroundImage?.src;

  const heightClasses: Record<HeroHeight, string> = {
    '25': 'min-h-[25vh]',
    '50': 'min-h-[50vh]',
    '90': 'min-h-[90vh]',
  };

  return (
    <section
      className={cn(
        heroVariants({
          background: hasBackgroundImage ? undefined : background,
        }),
        'relative overflow-hidden',
        heightClasses[height],
        {
          'flex flex-col justify-center py-12 md:py-24 lg:py-32':
            layout === 'default' || isCentered,
          'flex flex-col justify-end pt-24 pb-12 md:pt-32 md:pb-16': isBottom,
          'text-center': isCentered,
          'text-white': hasBackgroundImage,
        },
        className
      )}
      {...props}
    >
      {hasBackgroundImage && (
        <>
          <NextImage
            src={backgroundImage.src}
            alt={backgroundImage.alt || ''}
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity / 100 }}
          />
        </>
      )}

      <Container width="wide" className="relative z-10">
        <div
          className={cn('prose prose-theme max-w-none space-y-6', {
            'mx-auto max-w-4xl': isCentered,
            'prose-invert': hasBackgroundImage,
          })}
        >
          {title && (
            <Heading level="1" size="display-xxl">
              {title}
            </Heading>
          )}

          {description && (
            <BodyCopy
              size="lg"
              className={cn({ 'prose-invert': hasBackgroundImage })}
            >
              {description}
            </BodyCopy>
          )}

          {(primaryCta || secondaryCta) && (
            <div
              className={cn('flex flex-wrap gap-4', {
                'justify-center': isCentered,
              })}
            >
              {primaryCta && (
                <CallToAction
                  href={primaryCta.href}
                  variant={primaryCta.variant || 'button'}
                  size={primaryCta.size || 'big'}
                  target={primaryCta.target || '_self'}
                >
                  {primaryCta.text}
                </CallToAction>
              )}
              {secondaryCta && (
                <CallToAction
                  href={secondaryCta.href}
                  variant={secondaryCta.variant || 'buttonOutline'}
                  size={secondaryCta.size || 'big'}
                  target={secondaryCta.target || '_self'}
                >
                  {secondaryCta.text}
                </CallToAction>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Hero;
