import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { cva, type VariantProps } from 'class-variance-authority';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-lg transition-all duration-200', {
  variants: {
    mode: {
      flat: 'bg-transparent',
      card: 'bg-white shadow-md hover:shadow-lg border border-gray-200',
    },
  },
  defaultVariants: {
    mode: 'flat',
  },
});

// Pre-build all icon components outside of render
const icons = Object.keys(dynamicIconImports).reduce<
  Record<string, ReactElement>
>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);

  return {
    ...acc,
    [iconName]: <El />,
  };
}, {});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
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
        {icon && icons[icon] && (
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg [&>svg]:h-6 [&>svg]:w-6">
            {icons[icon]}
          </div>
        )}

        {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}

        {description && (
          <p className="text-base leading-relaxed text-gray-600">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;
