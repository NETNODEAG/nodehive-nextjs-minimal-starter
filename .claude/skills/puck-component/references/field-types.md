# Puck Field Types

## Built-in Field Types

### text

Single-line text input.

```tsx
title: {
  type: 'text',
  label: 'Title',
  placeholder: 'Enter title...',
  contentEditable: true, // enables inline editing
}
```

### textarea

Multi-line text input.

```tsx
description: {
  type: 'textarea',
  label: 'Description',
  placeholder: 'Enter description...',
  contentEditable: true,
}
```

### number

Numeric input with optional constraints.

```tsx
count: {
  type: 'number',
  label: 'Count',
  min: 0,
  max: 100,
  step: 1,
  placeholder: '0',
}
```

### select

Dropdown selection.

```tsx
alignment: {
  type: 'select',
  label: 'Alignment',
  options: [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ],
}
```

### radio

Radio button group.

```tsx
style: {
  type: 'radio',
  label: 'Style',
  options: [
    { label: 'Flat', value: 'flat' },
    { label: 'Card', value: 'card' },
  ],
}
```

### array

List of repeating items.

```tsx
items: {
  type: 'array',
  label: 'Items',
  min: 1,
  max: 5,
  arrayFields: {
    title: { type: 'text', label: 'Title' },
    description: { type: 'textarea', label: 'Description' },
  },
  defaultItemProps: {
    title: 'New Item',
  },
  getItemSummary: (item) => item.title || 'Item',
}
```

### object

Nested field group.

```tsx
settings: {
  type: 'object',
  label: 'Settings',
  objectFields: {
    enabled: { type: 'radio', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] },
    value: { type: 'number' },
  },
}
```

### slot

Container for nested components (layout components).

```tsx
// In fields:
content: {
  type: 'slot',
  allow: ['Heading', 'BodyCopy'], // optional: restrict allowed components
  disallow: ['Hero'], // optional: block specific components
}

// In render:
render: ({ content: Content }) => (
  <div>
    <Content
      allow={['Heading']}           // runtime override
      minEmptyHeight={64}           // min height when empty (default: 128)
      collisionAxis="y"             // 'x', 'y', or 'dynamic'
    />
  </div>
)
```

### external

Select data from external API.

```tsx
article: {
  type: 'external',
  label: 'Select Article',
  placeholder: 'Choose an article...',
  showSearch: true,
  initialQuery: '',
  fetchList: async ({ query, filters }) => {
    const response = await fetch(`/api/articles?q=${query}`);
    return response.json();
  },
  getItemSummary: (item) => item.title,
  mapProp: (item) => ({ id: item.id, title: item.title }),
  filterFields: {
    category: {
      type: 'select',
      options: [
        { label: 'All', value: '' },
        { label: 'News', value: 'news' },
      ],
    },
  },
}
```

### custom

Implement custom field UI.

```tsx
import type { CustomFieldRender } from '@measured/puck';

myField: {
  type: 'custom',
  label: 'My Field',
  render: (({ name, onChange, value, field }) => (
    <input
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.label}
    />
  )) satisfies CustomFieldRender<string>,
}
```

---

## Project Custom Fields

This project provides custom field factories in `src/components/puck/editor/field-utils.tsx`.

### Media Selector

Select media from Drupal media library:

```tsx
import { createMediaSelectorField } from '@/components/puck/editor/field-utils';

fields: {
  image: createMediaSelectorField({
    label: 'Image',
    mediaTypes: ['image'], // 'image', 'video', 'document'
  }),
}
```

### Rich Text Editor

CKEditor-based rich text:

```tsx
import { createTextEditorField } from '@/components/puck/editor/field-utils';

fields: {
  content: createTextEditorField({
    label: 'Content',
    editorType: 'default', // or 'title' for contentEditable
    showEnlargeButton: true,
  }),
}
```

### Date Picker

Calendar date selection:

```tsx
import { createDatePickerField } from '@/components/puck/editor/field-utils';

fields: {
  date: createDatePickerField({ label: 'Date' }),
}
```

### Node Selector

Fetch Drupal nodes via API:

```tsx
import { createNodeSelectorField } from '@/components/puck/editor/field-utils';

fields: {
  article: createNodeSelectorField({
    nodeType: 'article',
    label: 'Select Article',
    placeholder: 'Search articles...',
    showSearch: true,
    searchFields: ['title'],
  }),
}
```

### Checkbox Group

Multi-select checkbox options:

```tsx
import { createCheckboxGroupField } from '@/components/puck/editor/field-utils';

fields: {
  features: createCheckboxGroupField({
    label: 'Features',
    options: [
      { label: 'Feature A', value: 'feature-a' },
      { label: 'Feature B', value: 'feature-b' },
    ],
    helperText: 'Select which features to enable',
  }),
}
```
