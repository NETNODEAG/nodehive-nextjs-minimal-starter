import React from 'react';
import NextImage from 'next/image';

import { cn } from '@/lib/utils';
import type { SectionBackgroundVariant } from '@/components/puck/editor/field-utils';
import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';
import CallToAction from '@/components/theme/atoms-content/call-to-action/call-to-action';
import { Heading } from '@/components/theme/atoms-content/heading/heading';
import Container from '@/components/theme/atoms-layout/container/container';

export type HeroLayout = 'default' | 'centered' | 'bottom';
export type HeroHeight = '25' | '50' | '90';

export interface HeroProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'title'
> {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  layout?: HeroLayout;
  height?: HeroHeight;
  background?: SectionBackgroundVariant;
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

const HeroSection: React.FC<HeroProps> = ({
  title,
  description,
  primaryCta,
  secondaryCta,
  background = 'none',
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
    '25': 'min-h-[25vh] py-6 md:py-10',
    '50': 'min-h-[50vh] py-12 md:py-20',
    '90': 'min-h-[90vh] py-16 md:py-28',
  };

  return (
    <section
      data-section-theme={hasBackgroundImage ? 'dark' : background}
      className={cn(
        'bg-background text-foreground relative flex w-full flex-col overflow-hidden',
        heightClasses[height],
        {
          'justify-center': layout === 'default' || isCentered,
          'justify-end': isBottom,
          'text-center': isCentered,
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
          className={cn('space-y-6', {
            'mx-auto max-w-4xl': isCentered,
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
              className={cn({ 'mx-auto max-w-none': isCentered })}
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

export default HeroSection;
