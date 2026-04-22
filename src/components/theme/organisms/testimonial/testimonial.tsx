import React from 'react';
import NextImage from 'next/image';

import { cn } from '@/lib/utils';

export interface TestimonialProps {
  quote?: string;
  authorName?: string;
  authorRole?: string;
  authorCompany?: string;
  avatar?: {
    src: string;
    alt?: string;
  };
  className?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  authorName,
  authorRole,
  authorCompany,
  avatar,
  className,
}) => {
  const roleLine = [authorRole, authorCompany].filter(Boolean).join(', ');

  return (
    <figure className={cn('mx-auto max-w-2xl text-center', className)}>
      {quote && (
        <blockquote>
          <p className="text-foreground text-2xl leading-relaxed font-medium md:text-3xl">
            “{quote}”
          </p>
        </blockquote>
      )}
      {(authorName || avatar?.src) && (
        <figcaption className="mt-8 flex flex-col items-center gap-3">
          {avatar?.src && (
            <div className="relative h-14 w-14 overflow-hidden rounded-full">
              <NextImage
                src={avatar.src}
                alt={avatar.alt || ''}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            {authorName && (
              <div className="text-foreground font-semibold">{authorName}</div>
            )}
            {roleLine && (
              <div className="text-muted-foreground text-sm">{roleLine}</div>
            )}
          </div>
        </figcaption>
      )}
    </figure>
  );
};

export default Testimonial;
