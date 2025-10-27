import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { FormattedText } from '@/components/layout/formatted-text';

const statisticsVariants = cva('mx-auto max-w-7xl');

const gridVariants = cva('grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-3');

const statCardVariants = cva('flex flex-col gap-y-4', {
  variants: {
    variant: {
      default: '',
      bordered: 'border-t-4 border-primary pt-8',
      subtle: 'bg-gray-50 p-8 rounded-lg',
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

const textVariants = cva('prose prose-sm max-w-none', {
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
  stat1?: StatisticItemProps;
  stat2?: StatisticItemProps;
  stat3?: StatisticItemProps;
}

const StatisticItem: React.FC<
  StatisticItemProps & { variant?: 'default' | 'bordered' | 'subtle' }
> = ({ title, text, variant = 'default' }) => {
  return (
    <div className={cn(statCardVariants({ variant }))}>
      <p className={cn(titleVariants({ variant }))}>{title}</p>
      <FormattedText html={text} className={cn(textVariants({ variant }))} />
    </div>
  );
};

const Statistics: React.FC<StatisticsProps> = ({
  stat1,
  stat2,
  stat3,
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <section data-component-type="Statistics" {...props}>
      <div className={cn(statisticsVariants(), className)}>
        <div className={cn(gridVariants())}>
          {stat1 && <StatisticItem {...stat1} variant={variant} />}
          {stat2 && <StatisticItem {...stat2} variant={variant} />}
          {stat3 && <StatisticItem {...stat3} variant={variant} />}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
