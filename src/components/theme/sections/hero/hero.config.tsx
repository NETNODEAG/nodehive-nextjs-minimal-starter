import { ComponentConfig } from '@measured/puck';

import Hero from '@/components/theme/sections/hero/hero';

export const HeroConfig: ComponentConfig = {
  label: 'Hero Section',
  fields: {
    title: {
      type: 'text',
      label: 'Title',
      contentEditable: true,
    },
    description: {
      type: 'textarea',
      label: 'Description',
    },
    background: {
      type: 'select',
      label: 'Background Style',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Light', value: 'light' },
      ],
    },
    primaryCtaText: {
      type: 'text',
      label: 'Primary CTA Text',
    },
    primaryCtaHref: {
      type: 'text',
      label: 'Primary CTA Link',
    },
    primaryCtaVariant: {
      type: 'select',
      label: 'Primary CTA Style',
      options: [
        { label: 'Link', value: 'link' },
        { label: 'Button', value: 'button' },
        { label: 'Button Outline', value: 'buttonOutline' },
      ],
    },
    primaryCtaSize: {
      type: 'select',
      label: 'Primary CTA Size',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Big', value: 'big' },
      ],
    },
    primaryCtaTarget: {
      type: 'select',
      label: 'Primary CTA Target',
      options: [
        { label: 'Same Window', value: '_self' },
        { label: 'New Window', value: '_blank' },
      ],
    },
    secondaryCtaText: {
      type: 'text',
      label: 'Secondary CTA Text',
    },
    secondaryCtaHref: {
      type: 'text',
      label: 'Secondary CTA Link',
    },
    secondaryCtaVariant: {
      type: 'select',
      label: 'Secondary CTA Style',
      options: [
        { label: 'Link', value: 'link' },
        { label: 'Button', value: 'button' },
        { label: 'Button Outline', value: 'buttonOutline' },
      ],
    },
    secondaryCtaSize: {
      type: 'select',
      label: 'Secondary CTA Size',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Big', value: 'big' },
      ],
    },
    secondaryCtaTarget: {
      type: 'select',
      label: 'Secondary CTA Target',
      options: [
        { label: 'Same Window', value: '_self' },
        { label: 'New Window', value: '_blank' },
      ],
    },
  },
  defaultProps: {
    title: 'Welcome to Our Platform',
    description:
      'Build amazing experiences with our powerful tools and intuitive design system.',
    background: 'none',
    primaryCtaText: 'Get Started',
    primaryCtaHref: '#',
    primaryCtaVariant: 'button',
    primaryCtaSize: 'big',
    primaryCtaTarget: '_self',
    secondaryCtaText: 'Learn More',
    secondaryCtaHref: '#',
    secondaryCtaVariant: 'buttonOutline',
    secondaryCtaSize: 'big',
    secondaryCtaTarget: '_self',
  },
  render: ({
    title,
    description,
    background,
    primaryCtaText,
    primaryCtaHref,
    primaryCtaVariant,
    primaryCtaSize,
    primaryCtaTarget,
    secondaryCtaText,
    secondaryCtaHref,
    secondaryCtaVariant,
    secondaryCtaSize,
    secondaryCtaTarget,
  }) => {
    const primaryCta = primaryCtaText
      ? {
          text: primaryCtaText,
          href: primaryCtaHref,
          variant: primaryCtaVariant,
          size: primaryCtaSize,
          target: primaryCtaTarget,
        }
      : undefined;

    const secondaryCta = secondaryCtaText
      ? {
          text: secondaryCtaText,
          href: secondaryCtaHref,
          variant: secondaryCtaVariant,
          size: secondaryCtaSize,
          target: secondaryCtaTarget,
        }
      : undefined;

    return (
      <Hero
        title={title}
        description={description}
        background={background}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />
    );
  },
};
