import NextImage from 'next/image';

import { cn } from '@/lib/utils';

type ImageProps = {
  src: string;
  alt: string;
  aspectRatio?: string;
  fit?: 'cover' | 'contain';
};

const aspectRatioClasses: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-4/3',
  '1/1': 'aspect-square',
  '3/2': 'aspect-3/2',
  '21/9': 'aspect-21/9',
};

export default function Image({
  src,
  alt,
  aspectRatio = '16/9',
  fit = 'cover',
}: ImageProps) {
  return (
    <div
      className={cn('relative', {
        [aspectRatioClasses[aspectRatio!]]: aspectRatio,
      })}
    >
      <NextImage
        src={src}
        alt={alt}
        fill
        className={cn({
          'object-cover': fit === 'cover',
          'object-contain': fit === 'contain',
        })}
      />
    </div>
  );
}
