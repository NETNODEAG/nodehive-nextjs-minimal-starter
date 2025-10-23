import { ComponentConfig } from '@measured/puck';

import TwoColumnContent from '@/components/theme/sections/two-column-content/two-column-content';

export type TwoColumnContentConfigProps = {
  title?: string;
  bodyText?: string;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  columnRatio?: '1:1' | '1:2' | '2:1';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'light';
};

export const TwoColumnContentConfig: ComponentConfig<TwoColumnContentConfigProps> =
  {
    label: 'Two Column Content',
    fields: {
      title: {
        type: 'text',
        label: 'Title',
        contentEditable: true,
      },
      bodyText: {
        type: 'textarea',
        label: 'Body Text',
      },
      imageUrl: {
        type: 'text',
        label: 'Image URL',
      },
      imageAlt: {
        type: 'text',
        label: 'Image Alt Text',
      },
      imagePosition: {
        label: 'Image Position',
        type: 'select',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
        ],
      },
      columnRatio: {
        label: 'Column Ratio',
        type: 'select',
        options: [
          { label: '1:1 (50% / 50%)', value: '1:1' },
          { label: '1:2 (33% / 67%)', value: '1:2' },
          { label: '2:1 (67% / 33%)', value: '2:1' },
        ],
      },
      gap: {
        label: 'Gap Between Columns',
        type: 'select',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' },
        ],
      },
      background: {
        type: 'select',
        label: 'Background Style',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Light', value: 'light' },
        ],
      },
    },

    defaultProps: {
      title: 'Your Title Here',
      bodyText:
        'Add your body text content here. This is a great place to describe your product, service, or feature in detail.',
      imageUrl: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/sites/default/files/nodehive_login_screen.png`,
      imageAlt: 'NodeHive login screen',
      imagePosition: 'right',
      columnRatio: '1:1',
      gap: 'md',
      background: 'none',
    },

    render: (props: TwoColumnContentConfigProps) => (
      <TwoColumnContent {...props} />
    ),
  };
