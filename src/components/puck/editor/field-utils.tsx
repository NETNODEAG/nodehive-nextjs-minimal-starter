import type { CustomFieldRender } from '@measured/puck';

import { getLocaleFromPathname } from '@/lib/utils';
import { DatePicker } from '@/components/puck/editor/date-picker/date-picker';
import {
  MediaItem,
  MediaSelectorField,
} from '@/components/puck/editor/media-selector/media-selector-field';
import TextEditor from '@/components/puck/editor/text-editor/text-editor';
import VisualSettingsField, {
  VisualSettingsFieldProps,
} from '@/components/puck/editor/visual-settings-field/visual-settings-field';

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
    render: (({ field, value, onChange }) => (
      <TextEditor
        label={field.label ?? label}
        value={value}
        onChange={onChange}
        editorType={editorType}
        showEnlargeButton={showEnlargeButton}
      />
    )) satisfies CustomFieldRender<string>,
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
    render: (({ field, value, onChange }) => (
      <DatePicker
        date={value}
        onChange={onChange}
        label={field.label ?? label}
      />
    )) satisfies CustomFieldRender<string>,
  };
};

export interface MediaSelectorFieldOptions {
  mediaTypes?: string[];
  label?: string;
  fields?: string[]; // Array of property paths to save from API response
}

export const createMediaSelectorField = ({
  mediaTypes = ['image'],
  label = 'Media',
  fields,
}: MediaSelectorFieldOptions = {}) => {
  return {
    type: 'custom' as const,
    label,
    render: (({ onChange, value, field }) => (
      <MediaSelectorField
        onChange={onChange}
        value={value}
        mediaTypes={mediaTypes}
        label={field.label ?? label}
        fields={fields}
      />
    )) satisfies CustomFieldRender<MediaItem | null>,
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
    render: (({ field, value, onChange }) => (
      <VisualSettingsField
        value={value}
        onChange={onChange}
        showSpacing={showSpacing}
        showBackground={showBackground}
        label={field.label ?? label}
      />
    )) satisfies CustomFieldRender<VisualSettingsFieldProps['value']>,
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

export type NodeSelectorItem = {
  title?: string | null;
  [key: string]: unknown;
};

export interface NodeSelectorFieldOptions<
  TItem extends NodeSelectorItem = NodeSelectorItem,
> {
  nodeType: string;
  label?: string;
  locale?: string;
  placeholder?: string;
  showSearch?: boolean;
  initialQuery?: string;
  searchFields?: string[];
  getItemSummary?: (item: TItem) => string;
  mapRow?: (item: TItem) => TItem;
}

export const createNodeSelectorField = <
  TItem extends NodeSelectorItem = NodeSelectorItem,
>({
  nodeType,
  label = 'Node',
  placeholder = `Select ${nodeType}`,
  showSearch = true,
  initialQuery = '',
  searchFields = ['title'],
  getItemSummary,
  mapRow,
}: NodeSelectorFieldOptions<TItem>) => {
  return {
    type: 'external' as const,
    label,
    placeholder,
    showSearch,
    initialQuery,
    fetchList: async ({ query }: { query?: string } = {}): Promise<TItem[]> => {
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

      const data = (await response.json()) as unknown;

      if (!Array.isArray(data)) {
        throw new Error(`Invalid response format for ${nodeType} nodes`);
      }

      return data as TItem[];
    },
    getItemSummary:
      getItemSummary ||
      ((item: TItem) => {
        const summary = item?.title;
        return typeof summary === 'string' ? summary : '';
      }),
    mapRow:
      mapRow ||
      ((item: TItem): TItem => {
        return item;
      }),
  };
};
