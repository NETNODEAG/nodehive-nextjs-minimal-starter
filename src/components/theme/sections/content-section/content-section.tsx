import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';
import { Heading } from '@/components/theme/atoms-content/heading/heading';
import Container from '@/components/theme/atoms-layout/container/container';

const contentSectionVariants = cva('w-full py-12 md:py-20 lg:py-24', {
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

export type ContentSectionLayout =
  | 'stacked'
  | 'centered'
  | 'content-left'
  | 'media-left';

export type ContentSectionVariant = '1' | '2' | '3';

export interface ContentSectionProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'content'>,
    VariantProps<typeof contentSectionVariants> {
  title?: string | React.ReactNode;
  eyebrow?: string | React.ReactNode;
  body?: string | React.ReactNode;
  content?: React.FC;
  layout?: ContentSectionLayout;
  variant?: ContentSectionVariant;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  eyebrow,
  body,
  content: Content,
  background,
  layout = 'stacked',
  variant = '1',
  className,
  ...props
}) => {
  const isCentered = layout === 'centered';
  const isSideBySide = layout === 'content-left' || layout === 'media-left';
  const isMediaToEdge = isSideBySide && variant === '3';

  const textBlock = (
    <div
      className={cn('space-y-6', {
        'text-center': isCentered,
      })}
    >
      {eyebrow && (
        <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
          {eyebrow}
        </p>
      )}

      {title && (
        <Heading level="2" size="xl">
          {title}
        </Heading>
      )}

      {body && (
        <BodyCopy
          size="lg"
          className={cn({
            'mx-auto text-center': isCentered,
          })}
        >
          {body}
        </BodyCopy>
      )}
    </div>
  );

  const mediaBlock = Content ? <Content /> : null;

  // Stacked variants:
  //   1 = narrow content width
  //   2 = wide content width
  //   3 = full-width media
  if (layout === 'stacked' || layout === 'centered') {
    return (
      <section
        className={cn(contentSectionVariants({ background }), className)}
        {...props}
      >
        <Container width="wide">
          <div
            className={cn('space-y-8', {
              'max-w-3xl': variant === '1',
              'mx-auto max-w-3xl': variant === '1' && isCentered,
            })}
          >
            {textBlock}
          </div>
        </Container>
        {mediaBlock && (
          <div className="mt-8 px-4 md:px-8">
            <div
              className={cn('mx-auto', {
                'max-w-3xl': variant === '1',
                'max-w-7xl': variant === '2',
                'max-w-[120rem]': variant === '3',
              })}
            >
              {mediaBlock}
            </div>
          </div>
        )}
      </section>
    );
  }

  // Side-by-side variants:
  //   1 = equal 50/50 split
  //   2 = content column wider (7/5 split)
  //   3 = media bleeds to browser edge
  const gridClasses = cn('grid items-center gap-8 md:gap-12', {
    'md:grid-cols-2': variant === '1',
    'md:grid-cols-12': variant === '2' || variant === '3',
  });

  const contentColClass = cn({
    'md:col-span-7': variant === '2',
    'md:col-span-6': variant === '3',
  });

  const mediaColClass = cn({
    'md:col-span-5': variant === '2',
    'md:col-span-6': variant === '3',
  });

  const isContentFirst = layout === 'content-left';

  const contentCol = <div className={contentColClass}>{textBlock}</div>;

  const mediaCol = (
    <div
      className={cn(mediaColClass, {
        'overflow-hidden': isMediaToEdge,
        '[&_img]:h-full [&_img]:w-full [&_img]:object-cover': isMediaToEdge,
      })}
    >
      {mediaBlock}
    </div>
  );

  if (isMediaToEdge) {
    return (
      <section
        className={cn(contentSectionVariants({ background }), className)}
        {...props}
      >
        <div className="mx-auto max-w-[120rem] px-4 md:px-8">
          <div className={gridClasses}>
            {isContentFirst ? (
              <>
                {contentCol}
                {mediaCol}
              </>
            ) : (
              <>
                {mediaCol}
                {contentCol}
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(contentSectionVariants({ background }), className)}
      {...props}
    >
      <Container width="wide">
        <div className={gridClasses}>
          {isContentFirst ? (
            <>
              {contentCol}
              {mediaCol}
            </>
          ) : (
            <>
              {mediaCol}
              {contentCol}
            </>
          )}
        </div>
      </Container>
    </section>
  );
};

export default ContentSection;
