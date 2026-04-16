import { Config, Data } from '@puckeditor/core';

type AiMetadata = {
  aiDescription?: string;
  aiGuidelines?: string;
  [key: string]: any;
};

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

function serializeCategories(config: Config): string {
  const lines = Object.entries(config.categories || {})
    .filter(([name]) => name !== 'other')
    .map(([name, category]) => {
      const components = category.components?.join(', ') || '';
      return `- ${category.title || name}: ${components}`;
    });
  return lines.join('\n');
}

/**
 * Field-level detail for on-demand loading. Called by the get_component_spec
 * tool — returns fields, field hints, and default props. The component's
 * description and guidelines live in the summary prompt and are not duplicated
 * here. Returns null if the component does not exist in the config.
 */
export function serializeComponentSpec(
  name: string,
  config: Config
): string | null {
  const componentConfig = config.components?.[name];
  if (!componentConfig) return null;

  const fields = Object.entries(componentConfig.fields || {}).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ([fieldName, fieldConfig]: [string, any]) => {
      const fieldMetadata = (fieldConfig.metadata || {}) as AiMetadata;
      const hint = fieldMetadata.aiGuidelines
        ? ` | Hint: ${fieldMetadata.aiGuidelines}`
        : '';
      return `  - ${fieldName}: ${fieldConfig.type}${fieldConfig.label ? ` (${fieldConfig.label})` : ''}${serializeFieldOptions(fieldConfig)}${hint}`;
    }
  );

  return [
    `Default props: ${JSON.stringify(componentConfig.defaultProps || {})}`,
    'Fields:',
    fields.join('\n'),
  ].join('\n');
}

export function buildSystemPrompt(config: Config, puckData: Data): string {
  const componentSummaries = Object.entries(config.components || {}).map(
    ([name, componentConfig]) => {
      const metadata = (componentConfig.metadata || {}) as AiMetadata;
      const label = componentConfig.label;
      const category = getCategoryForComponent(name, config);

      const header = `- ${name}${label ? ` ("${label}")` : ''} [${category}]`;
      const lines = [header];
      if (metadata.aiDescription) {
        lines.push(`    Description: ${metadata.aiDescription}`);
      }
      if (metadata.aiGuidelines) {
        lines.push(`    Guidelines: ${metadata.aiGuidelines}`);
      }
      return lines.join('\n');
    }
  );

  const currentContent = JSON.stringify(puckData, null, 2);

  return `You are an AI assistant integrated into a visual page builder called Puck. You help users create and modify web page content by manipulating components.

AVAILABLE COMPONENTS:
Each entry shows the technical id ("display label") [category], a description of what the component is, and guidelines for how it should be used. Field-level details (default props, available fields, field hints) are loaded on demand via the get_component_spec tool.

${componentSummaries.join('\n')}

COMPONENT CATEGORIES:
${serializeCategories(config)}

CURRENT PAGE DATA:
${currentContent}

RULES:
1. Use the provided tools to manipulate page content. Never output raw JSON - always use tools.
2. Before adding or modifying a component, call get_component_spec("ComponentName") to retrieve its fields, default props, and field hints. Do NOT guess field names or values.
3. Use exact component type names (e.g., "Heading", "Container", "Hero").
4. For "slot" type fields, omit them from props - they are handled by the editor.
5. When adding images or videos, use the search_media tool first to find available media from the CMS.
6. Component IDs are auto-generated - never include "id" in props you set.
7. When modifying a component, reference it by its current ID from the page data.
8. When the user shares a URL, use fetch_url to analyze it and suggest content.
9. When the user shares an image, analyze it and suggest how to incorporate it.
10. Be concise in your responses. Describe what you did after making changes.
11. When creating a full page, build it section by section for a professional layout.
12. Respect each component's description and guidelines - do not misuse a component outside its intended purpose.`;
}
