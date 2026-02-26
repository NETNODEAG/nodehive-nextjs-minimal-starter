import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';
import CallToAction from '@/components/theme/atoms-content/call-to-action/call-to-action';
import { Heading } from '@/components/theme/atoms-content/heading/heading';
import Container from '../../atoms-layout/container/container';

const heroVariants = cva('w-full py-12 text-left md:py-24 lg:py-32', {
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

export interface HeroProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'title'>,
    VariantProps<typeof heroVariants> {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  primaryCta?: {
    text: string;
    href: string;
    variant?: 'link' | 'button' | 'buttonOutline';
    size?: 'small' | 'big';
    target?: '_self' | '_blank';
  };
  secondaryCta?: {
    text: string;
    href: string;
    variant?: 'link' | 'button' | 'buttonOutline';
    size?: 'small' | 'big';
    target?: '_self' | '_blank';
  };
}

const Hero: React.FC<HeroProps> = ({
  title,
  description,
  primaryCta,
  secondaryCta,
  background,
  className,
  ...props
}) => {
  return (
    <section className={cn(heroVariants({ background }), className)} {...props}>
      <Container width="wide">
        <div className="space-y-6">
          {title && (
            <Heading level="1" size="display-xxl">
              {title}
            </Heading>
          )}

          {description && <BodyCopy size="lg">{description}</BodyCopy>}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-4">
              {primaryCta && (
                <CallToAction
                  href={primaryCta.href}
                  variant={primaryCta.variant || 'button'}
                  size={primaryCta.size || 'big'}
                  target={primaryCta.target || '_self'}
                >
                  {primaryCta.text}
                </CallToAction>
              )}
              {secondaryCta && (
                <CallToAction
                  href={secondaryCta.href}
                  variant={secondaryCta.variant || 'buttonOutline'}
                  size={secondaryCta.size || 'big'}
                  target={secondaryCta.target || '_self'}
                >
                  {secondaryCta.text}
                </CallToAction>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Hero;
