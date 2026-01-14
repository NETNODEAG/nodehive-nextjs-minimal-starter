import { ComponentConfig } from '@puckeditor/core';

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
    cta: {
      type: 'array',
      label: 'Call to Actions',
      max: 3,
      arrayFields: {
        text: {
          type: 'text',
          label: 'Text',
        },
        variant: {
          type: 'select',
          label: 'Style',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Button', value: 'button' },
            { label: 'Button Outline', value: 'buttonOutline' },
          ],
        },
        size: {
          type: 'select',
          label: 'Size',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Big', value: 'big' },
          ],
        },
        target: {
          type: 'select',
          label: 'Target',
          options: [
            { label: 'Same Window', value: '_self' },
            { label: 'New Window', value: '_blank' },
          ],
        },
        href: {
          type: 'text',
          label: 'Link',
        },
      },
    },
  },
  defaultProps: {
    title: 'Welcome to Our Platform',
    description:
      'Build amazing experiences with our powerful tools and intuitive design system.',
    background: 'none',
    cta: [
      {
        text: 'Get Started',
        variant: 'button',
        size: 'big',
        target: '_self',
        href: '#',
      },
    ],
  },
  render: ({ title, description, background, cta }) => {
    console.log(cta);
    // const primaryCta = primaryCtaText
    //   ? {
    //       text: primaryCtaText,
    //       href: primaryCtaHref,
    //       variant: primaryCtaVariant,
    //       size: primaryCtaSize,
    //       target: primaryCtaTarget,
    //     }
    //   : undefined;

    // const secondaryCta = secondaryCtaText
    //   ? {
    //       text: secondaryCtaText,
    //       href: secondaryCtaHref,
    //       variant: secondaryCtaVariant,
    //       size: secondaryCtaSize,
    //       target: secondaryCtaTarget,
    //     }
    //   : undefined;

    return (
      <Hero
        title={title}
        description={description}
        background={background}
        // cta={}
        // primaryCta={primaryCta}
        // secondaryCta={secondaryCta}
      />
    );
  },
};
