import React from 'react';

import { cn } from '@/lib/utils';
import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';

export interface StatisticsItem {
  title: string;
  text?: string | React.ReactNode;
}

export interface StatisticsProps {
  items?: StatisticsItem[];
  className?: string;
}

const Statistics: React.FC<StatisticsProps> = ({ items = [], className }) => {
  const columnsClass = cn('grid gap-8 md:gap-12', {
    'grid-cols-1': items.length === 1,
    'grid-cols-1 md:grid-cols-2': items.length === 2,
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3':
      items.length === 3 || items.length > 4,
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': items.length === 4,
  });

  return (
    <div className={cn(columnsClass, className)}>
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-y-3">
          <p className="text-foreground text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            {item.title}
          </p>
          {item.text && (
            <BodyCopy className="prose-p:text-base prose-p:text-muted-foreground prose-strong:text-foreground">
              {item.text}
            </BodyCopy>
          )}
        </div>
      ))}
    </div>
  );
};

export default Statistics;
