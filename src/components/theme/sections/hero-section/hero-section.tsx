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

export interface HeroCta {
  text: string;
  href: string;
  variant?: 'link' | 'button' | 'buttonOutline';
  size?: 'small' | 'big';
  target?: '_self' | '_blank';
}

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
  ctas?: HeroCta[];
}

const HeroSection: React.FC<HeroProps> = ({
  title,
  description,
  ctas,
  background = 'none',
  backgroundImage,
  overlayOpacity = 50,
  layout = 'default',
  height = '50',
  className,
  ...props
}) => {
  const visibleCtas = ctas?.filter((cta) => cta?.text && cta?.href) ?? [];
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
          className={cn('space-y-8', {
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

          {visibleCtas.length > 0 && (
            <div
              className={cn('flex flex-wrap gap-4', {
                'justify-center': isCentered,
              })}
            >
              {visibleCtas.map((cta, index) => (
                <CallToAction
                  key={`${cta.href}-${index}`}
                  href={cta.href}
                  variant={
                    cta.variant || (index === 0 ? 'button' : 'buttonOutline')
                  }
                  size={cta.size || 'big'}
                  target={cta.target || '_self'}
                >
                  {cta.text}
                </CallToAction>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
