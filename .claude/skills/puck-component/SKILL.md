---
name: puck-component
description: "Create new Puck page builder components for the NodeHive Next.js starter. Use when asked to add, create, or build a new Puck component, visual editor component, or page builder block. Covers the full workflow - React component, Puck config, registration, and editor UI integration."
---

# Puck Component Creation

Create Puck page builder components following established patterns in this codebase.

## File Structure

Every Puck component has 3 files in `src/components/theme/{category}/{component-name}/`:

```
{component-name}/
├── {component-name}.tsx          # React component
├── {component-name}.config.tsx   # Puck configuration
└── {component-name}.stories.tsx  # Storybook stories (optional)
```

**Categories:**
- `atoms-content/` - Content primitives (Heading, BodyCopy, Image, Video)
- `atoms-layout/` - Layout primitives (Container, Grid, TwoColumns, Space)
- `organisms/` - Composed components (Card, Statistics)
- `sections/` - Full-width sections (Hero)

## Step 1: Create React Component

```tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const myComponentVariants = cva('base-classes', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {
  title?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  size,
  className,
  ...props
}) => {
  return (
    <div className={cn(myComponentVariants({ size }), className)} {...props}>
      {title && <h3>{title}</h3>}
    </div>
  );
};

export default MyComponent;
```

**Key patterns:**
- Use CVA for variants
- Extend `React.HTMLAttributes<HTMLElement>`
- Use `cn()` from `@/lib/utils` for class merging

## Step 2: Create Puck Config

```tsx
import { ComponentConfig } from '@puckeditor/core';
import MyComponent from './my-component';

export const MyComponentConfig: ComponentConfig = {
  label: 'My Component',
  fields: {
    title: { type: 'text', label: 'Title' },
    size: {
      type: 'select',
      label: 'Size',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
  },
  defaultProps: {
    title: 'Default Title',
    size: 'md',
  },
  render: ({ title, size }) => <MyComponent title={title} size={size} />,
};
```

For built-in field types, see [references/field-types.md](references/field-types.md).

## Step 3: Register in Puck Config

Edit `src/components/drupal/node/puck-page/puck.page.config.tsx`:

```tsx
import { MyComponentConfig } from '@/components/theme/{category}/my-component/my-component.config';

export const config: Config = {
  categories: {
    content: {
      components: ['Heading', 'MyComponent'], // Add to category
    },
  },
  components: {
    MyComponent: MyComponentConfig, // Register component
  },
};
```

## Step 4: Add Icon and Label

Edit `src/components/puck/editor/component-item.tsx`:

```tsx
import { MyIcon } from 'lucide-react';

const COMPONENT_ICONS: Record<string, React.ReactNode> = {
  MyComponent: <MyIcon className="size-4" />,
};

const COMPONENT_LABELS: Record<string, string> = {
  MyComponent: 'My Component',
};
```

## Array Fields

For repeating items:

```tsx
items: {
  type: 'array',
  label: 'Items',
  max: 5,
  arrayFields: {
    title: { type: 'text', label: 'Title' },
    description: { type: 'textarea', label: 'Description' },
  },
},
```

## Slot Fields (Layout Components)

For nesting other components:

```tsx
fields: {
  content: { type: 'slot' },
},
render: ({ content: Content }) => (
  <div>
    <Content />
  </div>
),
```

## References

- [Field Types Reference](references/field-types.md) - Built-in and custom field types
- [Puck Documentation](https://puckeditor.com/docs) - Official Puck docs