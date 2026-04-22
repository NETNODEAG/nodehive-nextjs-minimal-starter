import React from 'react';

import { cn } from '@/lib/utils';
import type { SectionBackgroundVariant } from '@/components/puck/editor/field-utils';
import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';
import { Heading } from '@/components/theme/atoms-content/heading/heading';
import Container from '@/components/theme/atoms-layout/container/container';

export type ContentSectionLayout = 'stacked' | 'centered' | 'side-by-side';
export type ContentSectionWidth = 'narrow' | 'wide' | 'full';
export type ContentSectionTextWidth = 'narrow' | 'wide';
export type ContentSectionSlotWidth = 'narrow' | 'wide' | 'full';
export type ContentSectionContentPosition = 'left' | 'right';
export type ContentSectionSplit = '50-50' | '60-40' | '40-60';

export interface ContentSectionProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'title' | 'content'
> {
  title?: string | React.ReactNode;
  eyebrow?: string | React.ReactNode;
  body?: string | React.ReactNode;
  content?: React.FC;
  layout?: ContentSectionLayout;
  width?: ContentSectionWidth;
  textWidth?: ContentSectionTextWidth;
  slotWidth?: ContentSectionSlotWidth;
  contentPosition?: ContentSectionContentPosition;
  split?: ContentSectionSplit;
  reverseOnMobile?: boolean;
  background?: SectionBackgroundVariant;
}

const widthClassMap = {
  narrow: 'max-w-4xl',
  wide: 'max-w-7xl',
  full: 'max-w-full',
} as const;

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  eyebrow,
  body,
  content: Content,
  background = 'none',
  layout = 'stacked',
  width = 'wide',
  textWidth = 'narrow',
  slotWidth = 'wide',
  contentPosition = 'left',
  split = '50-50',
  reverseOnMobile = false,
  className,
  ...props
}) => {
  const isCentered = layout === 'centered';
  const isSideBySide = layout === 'side-by-side';

  const textBlock = (
    <div className={cn('space-y-6', isCentered && 'text-center')}>
      {eyebrow && (
        <p className="text-primary text-sm font-semibold tracking-widest uppercase">
          {eyebrow}
        </p>
      )}
      {title && (
        <Heading
          level="2"
          size="xl"
          className={cn('max-w-prose', isCentered && 'mx-auto')}
        >
          {title}
        </Heading>
      )}
      {body && (
        <BodyCopy
          size="lg"
          className={cn('max-w-prose', isCentered && 'mx-auto text-center')}
        >
          {body}
        </BodyCopy>
      )}
    </div>
  );

  const slotBlock = Content ? <Content /> : null;

  if (isSideBySide) {
    const gridClass = cn(
      'gap-8 md:items-center md:gap-12',
      reverseOnMobile ? 'flex flex-col-reverse md:grid' : 'grid',
      split === '50-50' ? 'md:grid-cols-2' : 'md:grid-cols-5'
    );

    const leftSpanClass = cn(
      split === '60-40' && 'md:col-span-3',
      split === '40-60' && 'md:col-span-2'
    );

    const rightSpanClass = cn(
      split === '60-40' && 'md:col-span-2',
      split === '40-60' && 'md:col-span-3'
    );

    const isSlotLeft = contentPosition === 'left';

    return (
      <section className={className} {...props}>
        <Container background={background} width={width} spacingY="2xl">
          <div className={gridClass}>
            <div className={leftSpanClass}>
              {isSlotLeft ? slotBlock : textBlock}
            </div>
            <div className={rightSpanClass}>
              {isSlotLeft ? textBlock : slotBlock}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const textMaxClass = widthClassMap[textWidth];
  const slotMaxClass = widthClassMap[slotWidth];

  return (
    <section className={className} {...props}>
      <Container background={background} width="full" spacingY="2xl">
        <div className={cn('mx-auto', textMaxClass)}>{textBlock}</div>
        {slotBlock && (
          <div className={cn('mx-auto mt-8', slotMaxClass)}>{slotBlock}</div>
        )}
      </Container>
    </section>
  );
};

export default ContentSection;
