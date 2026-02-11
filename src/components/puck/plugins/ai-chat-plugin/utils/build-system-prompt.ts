import { Config, Data } from '@puckeditor/core';

function getCategoryForComponent(
  componentName: string,
  config: Config
): string {
  for (const [categoryName, category] of Object.entries(
    config.categories || {}
  )) {
    if (category.components?.includes(componentName)) {
      return categoryName;
    }
  }
  return 'other';
}

function serializeFieldOptions(field: any): string {
  if (field.options) {
    return ` | Options: ${field.options.map((o: any) => `"${o.value}"`).join(', ')}`;
  }
  if (field.arrayFields) {
    const subFields = Object.entries(field.arrayFields)
      .map(
        ([name, f]: [string, any]) =>
          `${name}: ${f.type}${serializeFieldOptions(f)}`
      )
      .join('; ');
    return ` | Array fields: { ${subFields} }`;
  }
  return '';
}

export function buildSystemPrompt(config: Config, puckData: Data): string {
  const components = Object.entries(config.components || {}).map(
    ([name, componentConfig]) => {
      const fields = Object.entries(componentConfig.fields || {}).map(
        ([fieldName, fieldConfig]: [string, any]) => {
          return `    - ${fieldName}: ${fieldConfig.type}${fieldConfig.label ? ` (${fieldConfig.label})` : ''}${serializeFieldOptions(fieldConfig)}`;
        }
      );

      return `  ${name} [${getCategoryForComponent(name, config)}]:
    Default props: ${JSON.stringify(componentConfig.defaultProps || {})}
    Fields:
${fields.join('\n')}`;
    }
  );

  const currentContent = JSON.stringify(puckData, null, 2);

  return `You are an AI assistant integrated into a visual page builder called Puck. You help users create and modify web page content by manipulating components.

AVAILABLE COMPONENTS:
${components.join('\n\n')}

COMPONENT CATEGORIES:
- sections: Full-width page sections (e.g., Hero)
- organisms: Complex composed components (e.g., Card, Statistics)
- layout: Layout containers (e.g., Container, Grid, TwoColumns, Space)
- content: Content primitives (e.g., Heading, BodyCopy, CallToAction, Image, Video)

CURRENT PAGE DATA:
${currentContent}

RULES:
1. Use the provided tools to manipulate page content. Never output raw JSON - always use tools.
2. Use exact component type names (e.g., "Heading", "Container", "Hero").
3. Use valid prop values that match the field definitions above.
4. For "slot" type fields, omit them from props - they are handled by the editor.
5. When adding images or videos, use the search_media tool first to find available media from the CMS.
6. For layout, use Container as a wrapper with spacing/width controls.
7. Component IDs are auto-generated - never include "id" in props you set.
8. When modifying a component, reference it by its current ID from the page data.
9. When the user shares a URL, use fetch_url to analyze it and suggest content.
10. When the user shares an image, analyze it and suggest how to incorporate it.
11. Be concise in your responses. Describe what you did after making changes.
12. When creating a full page, build it section by section for a professional layout.`;
}
