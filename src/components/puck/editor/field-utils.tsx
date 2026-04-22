import type { CustomFieldRender } from '@puckeditor/core';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

import { getLocaleFromPathname } from '@/lib/utils';
import { CheckboxGroupField } from '@/components/puck/editor/checkbox-group/checkbox-group-field';
import { DatePicker } from '@/components/puck/editor/date-picker/date-picker';
import {
  MediaItem,
  MediaSelectorField,
} from '@/components/puck/editor/media-selector/media-selector-field';

export type SectionBackgroundVariant = 'none' | 'light' | 'dark' | 'primary';

const BACKGROUND_LABELS: Record<SectionBackgroundVariant, string> = {
  none: 'None',
  light: 'Light',
  dark: 'Dark',
  primary: 'Primary (brand)',
};

export const createSectionBackgroundField = (
  variants: SectionBackgroundVariant[] = ['none', 'light', 'dark']
) => {
  return {
    type: 'select' as const,
    label: 'Background',
    options: variants.map((v) => ({ label: BACKGROUND_LABELS[v], value: v })),
    metadata: {
      ai: {
        instructions: `Use to create visual rhythm between sections:
  - none: default transparent — blends into the page
  - light: subtle grey tint — softens the divide between two neutral sections
  - dark: strong contrast — use sparingly for emphasis (final CTA, closing stats)
  - primary: brand-colored — rare, only for a single conversion moment per page`,
      },
    },
  };
};

export type SectionSpacing = 'sm' | 'md' | 'lg';

const SPACING_LABELS: Record<SectionSpacing, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
};

const lucideIconOptions = [
  { label: 'None', value: '' },
  ...Object.keys(dynamicIconImports)
    .sort()
    .map((name) => ({ label: name, value: name })),
];

export const createLucideIconField = (label = 'Icon') => ({
  type: 'select' as const,
  label,
  options: lucideIconOptions,
  metadata: {
    ai: {
      instructions:
        'Pick a lucide-react icon name (kebab-case, e.g. "rocket", "shield-check", "bar-chart"). Leave empty for no icon.',
    },
  },
});

export const createSectionSpacingField = () => ({
  type: 'select' as const,
  label: 'Spacing',
  options: (Object.keys(SPACING_LABELS) as SectionSpacing[]).map((v) => ({
    label: SPACING_LABELS[v],
    value: v,
  })),
  metadata: {
    ai: {
      instructions:
        'Vertical padding above and below the section content. Default md. Use sm for dense areas (e.g. a row of stats directly after a related section). Use lg for emphasis or to give a section breathing room.',
    },
  },
});

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
    metadata: {
      ai: {
        bind: 'search_media',
        instructions: `Value must be a full media object returned by search_media (type: ${mediaTypes.join(', ')}). Never construct one by hand.`,
      },
    },
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

export interface CheckboxGroupFieldOptions {
  label?: string;
  options: Array<{ label: string; value: string }>;
  helperText?: string;
}

export const createCheckboxGroupField = ({
  label = 'Options',
  options,
  helperText,
}: CheckboxGroupFieldOptions) => {
  return {
    type: 'custom' as const,
    label,
    render: (({ field, value, onChange }) => (
      <CheckboxGroupField
        label={field.label ?? label}
        options={options}
        value={value}
        onChange={onChange}
        helperText={helperText}
      />
    )) satisfies CustomFieldRender<string[]>,
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
