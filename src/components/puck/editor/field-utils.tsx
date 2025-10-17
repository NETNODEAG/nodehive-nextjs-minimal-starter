import { getLocaleFromPathname } from '@/lib/utils';
import { DatePicker } from '@/components/puck/editor/date-picker/date-picker';
import { MediaSelectorField } from '@/components/puck/editor/media-selector/media-selector-field';
import TextEditor from '@/components/puck/editor/text-editor/text-editor';
import VisualSettingsField from '@/components/puck/editor/visual-settings-field/visual-settings-field';

export interface TextEditorFieldOptions {
  label?: string;
  editorType?: 'default' | 'title';
  showEnlargeButton?: boolean;
}

export const createTextEditorField = ({
  label = 'Text',
  editorType = 'default',
  showEnlargeButton = true,
}: TextEditorFieldOptions = {}) => {
  return {
    type: 'custom' as const,
    contentEditable: editorType === 'title' ? true : false,
    label,
    render: ({ field, value, onChange }) => {
      return (
        <TextEditor
          label={field.label}
          value={value}
          onChange={onChange}
          editorType={editorType}
          showEnlargeButton={showEnlargeButton}
        />
      );
    },
  };
};

export interface DatePickerFieldOptions {
  label?: string;
}

export const createDatePickerField = ({
  label = 'Datum',
}: DatePickerFieldOptions = {}) => {
  return {
    type: 'custom' as const,
    label,
    render: ({ onChange, value, field }) => {
      return (
        <DatePicker date={value} onChange={onChange} label={field.label} />
      );
    },
  };
};

export interface MediaSelectorFieldOptions {
  mediaTypes?: string[];
  label?: string;
}

export const createMediaSelectorField = ({
  mediaTypes = ['image'],
  label = 'Media',
}: MediaSelectorFieldOptions = {}) => {
  return {
    type: 'custom' as const,
    label,
    render: ({ onChange, value, field }) => {
      return (
        <MediaSelectorField
          onChange={onChange}
          value={value}
          mediaTypes={mediaTypes}
          label={field.label}
        />
      );
    },
  };
};

export interface VisualSettingsFieldOptions {
  showSpacing?: boolean;
  showBackground?: boolean;
  label?: string;
}

export const createVisualSettingsField = ({
  showSpacing = true,
  showBackground = true,
  label = 'Visual Settings',
}: VisualSettingsFieldOptions = {}) => {
  return {
    type: 'custom' as const,
    label,
    render: ({ value, onChange }) => {
      return (
        <VisualSettingsField
          value={value}
          onChange={onChange}
          showSpacing={showSpacing}
          showBackground={showBackground}
          label={label}
        />
      );
    },
  };
};

export interface ColorSelectFieldOptions {
  mapping: Record<string, string>;
  label?: string;
}

export const createColorSelectField = ({
  mapping,
  label = 'Color',
}: ColorSelectFieldOptions) => {
  return {
    type: 'select' as const,
    label,
    options: Object.keys(mapping).map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: key,
    })),
  };
};

export interface NodeSelectorFieldOptions {
  nodeType: string;
  label?: string;
  locale?: string;
  placeholder?: string;
  showSearch?: boolean;
  initialQuery?: string;
  searchFields?: string[];
  getItemSummary?: (item: any) => string;
  mapRow?: (item: any) => any;
}

export const createNodeSelectorField = ({
  nodeType,
  label = 'Node',
  placeholder = `Select ${nodeType}`,
  showSearch = true,
  initialQuery = '',
  searchFields = ['title'],
  getItemSummary,
  mapRow,
}: NodeSelectorFieldOptions) => {
  return {
    type: 'external' as const,
    label,
    placeholder,
    showSearch,
    initialQuery,
    fetchList: async ({ query }: { query?: string } = {}) => {
      const normalizedLocale = getLocaleFromPathname(window.location.pathname);

      const url = new URL(
        `/${normalizedLocale}/api/puck/node/${nodeType}`,
        window.location.origin
      );

      if (query) {
        url.searchParams.set('query', query);
      }

      if (searchFields.length > 0) {
        url.searchParams.set('searchFields', searchFields.join(','));
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch ${nodeType} nodes`);
      }

      const data = await response.json();
      return data;
    },
    getItemSummary:
      getItemSummary ||
      ((item: any) => {
        return item?.title;
      }),
    mapRow:
      mapRow ||
      ((item: any) => {
        return item;
      }),
  };
};
