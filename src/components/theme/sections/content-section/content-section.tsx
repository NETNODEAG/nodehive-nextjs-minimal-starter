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
      dark: 'bg-gray-900 text-white',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
    },
  },
  defaultVariants: {
    background: 'none',
    align: 'left',
  },
});

export interface ContentSectionProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'title'>,
    VariantProps<typeof contentSectionVariants> {
  title?: string | React.ReactNode;
  eyebrow?: string | React.ReactNode;
  body?: string | React.ReactNode;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  eyebrow,
  body,
  background,
  align,
  className,
  ...props
}) => {
  return (
    <section
      className={cn(contentSectionVariants({ background, align }), className)}
      {...props}
    >
      <Container width="wide">
        <div
          className={cn('space-y-6', {
            'text-center': align === 'center',
          })}
        >
          {eyebrow && (
            <p
              className={cn(
                'text-sm font-semibold tracking-widest uppercase',
                background === 'dark' ? 'text-blue-400' : 'text-blue-600'
              )}
            >
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
              className={cn({ 'prose-invert': background === 'dark' })}
            >
              {body}
            </BodyCopy>
          )}
        </div>
      </Container>
    </section>
  );
};

export default ContentSection;
