import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-lg transition-all duration-200', {
  variants: {
    mode: {
      flat: 'bg-transparent',
      card: 'border-border bg-card border shadow-md hover:shadow-lg',
    },
  },
  defaultVariants: {
    mode: 'flat',
  },
});

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: string;
  description?: string;
  icon?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  mode,
  className,
  ...props
}) => {
  return (
    <div className={cn(cardVariants({ mode }), className)} {...props}>
      <div className="space-y-4 p-6">
        {icon && (
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
            <DynamicIcon name={icon as IconName} className="h-6 w-6" />
          </div>
        )}

        {title && (
          <h3 className="text-foreground text-xl font-bold">{title}</h3>
        )}

        {description && (
          <p className="text-muted-foreground text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;
