import React from 'react';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';
import { Heading } from '@/components/theme/atoms-content/heading/heading';
import Container from '../../atoms-layout/container/container';

const twoColumnContentVariants = cva('w-full py-12 md:py-24', {
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

// Map ratio to grid column classes
const ratioToGridClasses = {
  '1:1': 'md:grid-cols-2',
  '1:2': 'md:grid-cols-3',
  '2:1': 'md:grid-cols-3',
} as const;

// Map ratio to individual column span classes
const ratioToColumnSpans = {
  '1:1': { left: 'md:col-span-1', right: 'md:col-span-1' },
  '1:2': { left: 'md:col-span-1', right: 'md:col-span-2' },
  '2:1': { left: 'md:col-span-2', right: 'md:col-span-1' },
} as const;

// Map gap to classes
const gapToClasses = {
  sm: 'gap-4',
  md: 'gap-6 md:gap-8',
  lg: 'gap-8 md:gap-12',
  xl: 'gap-12 md:gap-16',
} as const;

export interface TwoColumnContentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof twoColumnContentVariants> {
  title?: string;
  bodyText?: string;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  columnRatio?: '1:1' | '1:2' | '2:1';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const TwoColumnContent: React.FC<TwoColumnContentProps> = ({
  title,
  bodyText,
  imageUrl,
  imageAlt = 'Image',
  imagePosition = 'right',
  columnRatio = '1:1',
  gap = 'md',
  background,
  className,
  ...props
}) => {
  const gridClass = ratioToGridClasses[columnRatio];
  const columnSpans = ratioToColumnSpans[columnRatio];
  const gapClass = gapToClasses[gap];

  const textContent = (
    <div className="flex flex-col justify-center space-y-6">
      {title && (
        <Heading level="2" size="lg">
          {title}
        </Heading>
      )}
      {bodyText && <BodyCopy size="lg">{bodyText}</BodyCopy>}
    </div>
  );

  const imageContent = imageUrl && (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );

  return (
    <section
      className={cn(twoColumnContentVariants({ background }), className)}
      {...props}
    >
      <Container>
        <div className={cn('grid grid-cols-1', gridClass, gapClass)}>
          <div
            className={cn(
              columnSpans.left,
              imagePosition === 'right' ? 'order-1' : 'order-2 md:order-1'
            )}
          >
            {imagePosition === 'left' ? imageContent : textContent}
          </div>
          <div
            className={cn(
              columnSpans.right,
              imagePosition === 'right' ? 'order-2' : 'order-1 md:order-2'
            )}
          >
            {imagePosition === 'right' ? imageContent : textContent}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TwoColumnContent;
