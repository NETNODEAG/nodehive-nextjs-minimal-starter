import { ComponentConfig } from '@measured/puck';

import { createMediaSelectorField } from '@/components/puck/editor/field-utils';
import Image from '@/components/theme/atoms-content/image/image';

export const ImageConfig: ComponentConfig = {
  label: 'Image',
  fields: {
    image: createMediaSelectorField({
      label: 'Image',
      mediaTypes: ['image'],
    }),
    aspectRatio: {
      label: 'Aspect Ratio',
      type: 'select',
      options: [
        { label: '16:9 (Widescreen)', value: '16/9' },
        { label: '4:3 (Standard)', value: '4/3' },
        { label: '1:1 (Quadrat)', value: '1/1' },
        { label: '3:2 (Photo)', value: '3/2' },
        { label: '21:9 (Ultrawide)', value: '21/9' },
      ],
    },
    fit: {
      label: 'Bildanpassung',
      type: 'select',
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
      ],
    },
  },

  resolveFields: (data, params) => {
    const orderedFields: any = {
      image: params.fields.image,
    };

    if (data.props.image?.field_media_image?.image_style_uri) {
      const imageStyleUri = data.props.image.field_media_image.image_style_uri;
      const availableStyles = Object.keys(imageStyleUri).filter(
        (key) => imageStyleUri[key]
      );

      if (availableStyles.length > 0) {
        const styleOptions = availableStyles.map((styleKey) => {
          // Create human-readable labels
          const label = styleKey
            .replace(/_/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return { label, value: styleKey };
        });

        orderedFields.imageStyle = {
          label: 'Bild Zuschnitt',
          type: 'select',
          options: styleOptions,
        };
      }
    }

    orderedFields.aspectRatio = params.fields.aspectRatio;

    return orderedFields;
  },
  defaultProps: {
    imageStyle: '',
    aspectRatio: '16/9',
    fit: 'cover',
  },

  render: ({ image, imageStyle, aspectRatio, fit }) => {
    const imageAlt = image?.field_media_image?.meta?.alt || 'Image';
    let imageSrc =
      image?.field_media_image?.uri ||
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/sites/default/files/nodehive_login_screen.png`;
    const imageStyleUri = image?.field_media_image?.image_style_uri;

    if (imageStyle && imageStyleUri && imageStyleUri[imageStyle]) {
      imageSrc = imageStyleUri[imageStyle];
    }

    return (
      <Image
        src={imageSrc}
        alt={imageAlt}
        aspectRatio={aspectRatio}
        fit={fit}
      />
    );
  },
};
