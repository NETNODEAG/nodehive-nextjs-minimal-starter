import { ComponentConfig } from '@puckeditor/core';

import {
  ChevronDownIcon,
  CloseIcon,
  EditIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@/lib/icons';
import CallToAction from '@/components/theme/atoms-content/call-to-action/call-to-action';

const iconOptions = [
  { value: '', label: 'No Icon' },
  { value: 'edit', label: 'Edit' },
];

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'chevron-down': <ChevronDownIcon />,
    edit: <EditIcon />,
    close: <CloseIcon />,
    instagram: <InstagramIcon />,
    twitter: <TwitterIcon />,
    youtube: <YoutubeIcon />,
  };
  return iconMap[iconName] || null;
};

export const CallToActionConfig: ComponentConfig = {
  label: 'Call to Action',
  metadata: {
    ai: {
      description: 'Link or button that drives the user to take an action.',
      instructions:
        'Text should be action-oriented (3-5 words, verb-led: "Get started", "Request demo").',
    },
  },
  fields: {
    text: {
      type: 'text',
      label: 'Text',
    },
    href: {
      type: 'text',
      label: 'Link URL',
    },
    variant: {
      type: 'select',
      label: 'Display Style',
      options: [
        { value: 'link', label: 'Link' },
        { value: 'button', label: 'Button' },
        { value: 'buttonOutline', label: 'Button Outline' },
      ],
      metadata: {
        ai: {
          instructions:
            'button: primary CTA, strong emphasis. buttonOutline: secondary CTA, less dominant. link: inline or tertiary CTA.',
        },
      },
    },
    size: {
      type: 'select',
      label: 'Size',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'big', label: 'Big' },
      ],
    },
    icon: {
      type: 'select',
      label: 'Icon',
      options: iconOptions,
    },
    iconPosition: {
      type: 'select',
      label: 'Icon Position',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
    },
    target: {
      type: 'select',
      label: 'Link Target',
      options: [
        { value: '_self', label: 'Same Window' },
        { value: '_blank', label: 'New Window' },
      ],
    },
  },
  defaultProps: {
    text: 'Get started',
    href: '#',
    variant: 'button',
    size: 'big',
    icon: '',
    iconPosition: 'right',
    target: '_self',
  },
  render: ({ text, href, variant, size, icon, iconPosition, target }) => (
    <CallToAction
      href={href}
      variant={variant}
      size={size}
      icon={getIconComponent(icon)}
      iconPosition={iconPosition}
      target={target}
      text={text}
    >
      {text}
    </CallToAction>
  ),
};
