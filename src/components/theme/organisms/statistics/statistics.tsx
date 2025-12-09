import React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';

const statisticsVariants = cva('mx-auto max-w-7xl');

const gridVariants = cva('grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-3');

const statCardVariants = cva('flex flex-col gap-y-4', {
  variants: {
    variant: {
      default: '',
      bordered: 'border-primary border-t-4 pt-8',
      subtle: 'rounded-lg bg-gray-50 p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const titleVariants = cva(
  'order-first text-5xl font-semibold tracking-tight sm:text-6xl',
  {
    variants: {
      variant: {
        default: 'text-gray-900',
        bordered: 'text-gray-900',
        subtle: 'text-gray-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const textVariants = cva('prose prose-theme max-w-none', {
  variants: {
    variant: {
      default:
        'prose-p:text-base prose-p:leading-7 prose-p:text-gray-600 prose-strong:font-semibold prose-strong:text-gray-900',
      bordered:
        'prose-p:text-base prose-p:leading-7 prose-p:text-gray-600 prose-strong:font-semibold prose-strong:text-gray-900',
      subtle:
        'prose-p:text-base prose-p:leading-7 prose-p:text-gray-600 prose-strong:font-semibold prose-strong:text-gray-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface StatisticItemProps {
  title: string;
  text: string;
}

export interface StatisticsProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'bordered' | 'subtle';
  items?: StatisticItemProps[];
}

const StatisticItem: React.FC<
  StatisticItemProps & { variant?: 'default' | 'bordered' | 'subtle' }
> = ({ title, text, variant = 'default' }) => {
  return (
    <div className={cn(statCardVariants({ variant }))}>
      <p className={cn(titleVariants({ variant }))}>{title}</p>
      <BodyCopy className={cn(textVariants({ variant }))}>{text}</BodyCopy>
    </div>
  );
};

const Statistics: React.FC<StatisticsProps> = ({
  items = [],
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <section data-component-type="Statistics" {...props}>
      <div className={cn(statisticsVariants(), className)}>
        <div className={cn(gridVariants())}>
          {items.map((item, index) => (
            <StatisticItem key={index} {...item} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
