import { Config, Data } from '@puckeditor/core';

function getComponentAi(componentConfig: any) {
  return (componentConfig?.ai || {}) as {
    description?: string;
    instructions?: string;
    exclude?: boolean;
  };
}

function getFieldAi(field: any) {
  return (field?.metadata?.ai || {}) as {
    instructions?: string;
    bind?: string;
  };
}

function isExcluded(componentConfig: any): boolean {
  return getComponentAi(componentConfig).exclude === true;
}

function getVisibleComponents(config: Config): [string, any][] {
  return Object.entries(config.components || {}).filter(
    ([, componentConfig]) => !isExcluded(componentConfig)
  );
}

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
  if (field.type === 'slot') {
    let restriction = ' | Allowed children: any';
    if (field.allow) {
      restriction = ` | Allowed children: ${field.allow.map((c: string) => `"${c}"`).join(', ')}`;
    } else if (field.disallow) {
      restriction = ` | Disallowed children: ${field.disallow.map((c: string) => `"${c}"`).join(', ')}`;
    }
    return `${restriction} | Value: array of { type, props } — populate with nested components`;
  }
  return '';
}

function serializeRootFields(config: Config): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootFields = ((config.root as any)?.fields || {}) as Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >;
  const lines = Object.entries(rootFields).map(([fieldName, fieldConfig]) => {
    const fieldAi = getFieldAi(fieldConfig);
    const hint = fieldAi.instructions ? ` | Hint: ${fieldAi.instructions}` : '';
    const bind = fieldAi.bind
      ? ` | BOUND TO TOOL: "${fieldAi.bind}" — value MUST come from this tool's output, never invented`
      : '';
    return `  - ${fieldName}: ${fieldConfig.type}${fieldConfig.label ? ` (${fieldConfig.label})` : ''}${serializeFieldOptions(fieldConfig)}${hint}${bind}`;
  });
  return lines.join('\n');
}

function serializeCategories(config: Config): string {
  const lines = Object.entries(config.categories || {})
    .filter(([name]) => name !== 'other')
    .map(([name, category]) => {
      const components =
        category.components
          ?.filter((c) => !isExcluded(config.components?.[c]))
          .join(', ') || '';
      return `- ${category.title || name}: ${components}`;
    })
    .filter((line) => !line.endsWith(': '));
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
  if (!componentConfig || isExcluded(componentConfig)) return null;

  const fields = Object.entries(componentConfig.fields || {}).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ([fieldName, fieldConfig]: [string, any]) => {
      const fieldAi = getFieldAi(fieldConfig);
      const hint = fieldAi.instructions
        ? ` | Hint: ${fieldAi.instructions}`
        : '';
      const bind = fieldAi.bind
        ? ` | BOUND TO TOOL: "${fieldAi.bind}" — value MUST come from this tool's output, never invented`
        : '';
      return `  - ${fieldName}: ${fieldConfig.type}${fieldConfig.label ? ` (${fieldConfig.label})` : ''}${serializeFieldOptions(fieldConfig)}${hint}${bind}`;
    }
  );

  return [
    `Default props: ${JSON.stringify(componentConfig.defaultProps || {})}`,
    'Fields:',
    fields.join('\n'),
  ].join('\n');
}

export function buildSystemPrompt(
  config: Config,
  puckData: Data,
  context?: string
): string {
  const componentSummaries = getVisibleComponents(config).map(
    ([name, componentConfig]) => {
      const ai = getComponentAi(componentConfig);
      const label = componentConfig.label;
      const category = getCategoryForComponent(name, config);

      const header = `- ${name}${label ? ` ("${label}")` : ''} [${category}]`;
      const lines = [header];
      if (ai.description) {
        lines.push(`    Description: ${ai.description}`);
      }
      if (ai.instructions) {
        lines.push(`    Instructions: ${ai.instructions}`);
      }
      return lines.join('\n');
    }
  );

  const currentContent = JSON.stringify(puckData, null, 2);
  const contextBlock = context?.trim()
    ? `BUSINESS CONTEXT:\n${context.trim()}\n\n`
    : '';
  const rootFieldsBlock = serializeRootFields(config);
  const rootSection = rootFieldsBlock
    ? `\nPAGE METADATA FIELDS (set via the set_page_metadata tool):\n${rootFieldsBlock}\n`
    : '';

  return `You are an AI assistant integrated into a visual page builder called Puck. You help users create and modify web page content by manipulating components.

CONTENT AUDIENCE (critical — easy to get wrong):
- Page content is written FOR END VISITORS of the published website, not for the person chatting with you right now.
- Never put chat-style offers or meta-commentary into components ("If you want, we can discuss your requirements together", "Let us know if we can help you evaluate…"). That is chat output, not page copy.
- Content should describe the subject of the page (the company, the product, the service) in third-person or brand voice — not address the current chat user as "you/dir/du".
- CTAs should name the user action, not the process ("Demo anfragen", "Kontakt aufnehmen", "Jetzt testen"). Avoid generic filler like "Nächster Schritt", "Call to Action", "Mehr erfahren" unless a concrete destination justifies it.
- If you want to suggest or discuss a change with the chat user, say it in your chat reply — never encode it as page content.

${contextBlock}AVAILABLE COMPONENTS:
Each entry shows the technical id ("display label") [category], a description of what the component is, and guidelines for how it should be used. Field-level details (default props, available fields, field hints) are loaded on demand via the get_component_spec tool.

${componentSummaries.join('\n')}

COMPONENT CATEGORIES:
${serializeCategories(config)}
${rootSection}
CURRENT PAGE DATA:
${currentContent}

STRUCTURE RULES (critical — pages render wrong if ignored):
- The root (top-level) content array MUST contain ONLY components from these categories:
  - "sections" (e.g., Hero, ContentSection) — full-width, never nested inside anything.
  - "layout" Containers (e.g., Container) — wrap the actual content of a page region.
- Components from "organisms" (Card, Statistics) and "content" (Heading, BodyCopy, CallToAction, Image, Video) MUST NEVER appear at the root. They only belong inside a slot field of a Container, Grid, TwoColumns, or Section.
- Grid and TwoColumns are wrappers too. They go inside a Container's "content" slot (or a Section's slot where allowed), never at the root.
- When in doubt: root = Sections + Containers. Everything else lives inside a slot.

PREFER SECTIONS OVER RAW CONTENT:
- For a page intro or hero area, always use the Hero section — do NOT build it from Heading + BodyCopy + CallToAction inside a Container.
- For a standard titled content block (title + body + optional media), prefer the ContentSection over a Container with separate Heading/BodyCopy/Image blocks.
- Only fall back to Container + raw content blocks when no section fits the use case (e.g., custom grids of Cards, Statistics rows).

SPACING BETWEEN BLOCKS:
- Children inside a Container do NOT get automatic vertical spacing. To separate adjacent content/organism blocks visually, insert a "Space" component between them.
- Typical usage: after a Heading that precedes a BodyCopy, between a BodyCopy and a CallToAction, between two Card groups, etc.
- Sections (Hero, ContentSection) manage their own internal spacing — no Space needed between them.
- Grid and TwoColumns use their own "gap" field — no Space needed between their children.
- Call get_component_spec("Space") for its fields (size/height).

SLOT FIELDS (how to nest):
- A field with type "slot" holds a list of child components on a specific parent. Nesting is achieved by TARGETING the parent in add_component, not by embedding child arrays in props.
- Workflow:
    1. add_component({ type: "Container", props: {...} })  → returns id like "Container-abc"
    2. add_component({ type: "Heading", props: {...}, destinationId: "Container-abc", destinationSlot: "content" })
    3. add_component({ type: "Grid", props: {...}, destinationId: "Container-abc", destinationSlot: "content" }) → returns id like "Grid-xyz"
    4. add_component({ type: "Card", props: {...}, destinationId: "Grid-xyz", destinationSlot: "content" })
- Each add_component call emits a separate incremental patch — the page updates live after every step.
- Some slot fields restrict what may be nested (see "Allowed children" / "Disallowed children" in get_component_spec). Respect them.
- IDs are auto-generated and returned in each tool result. Remember them to target nested children in subsequent calls. Never pass "id" in props yourself.

TOOL RULES:
1. Use the provided tools to manipulate page content. Never output raw JSON - always use tools.
2. Build pages incrementally with add_component — one component per call. Target nested positions via destinationId + destinationSlot (see SLOT FIELDS above). The editor applies each call immediately; users see the page build step by step.
3. To clear existing content, call remove_component for each component you want gone. Do not fear multiple tool calls — call them all in a single turn.
4. Before adding or modifying a component, call get_component_spec("ComponentName") to retrieve its fields, default props, and field hints. Do NOT guess field names or values.
5. Use exact component type names (e.g., "Heading", "Container", "Hero").
6. When adding images or videos, use the search_media tool first to find available media from the CMS. NEVER invent a URL, ID, or media object.
   - Any field marked "BOUND TO TOOL: <toolName>" in get_component_spec MUST be filled from that tool's output, verbatim. Do not synthesize a value.
7. When modifying or removing a component, reference it by its current ID from the page data or from a previous add_component result.
8. Page-level metadata (SEO title, description, URL alias, published state, OG image) is separate from the component tree — set it with set_page_metadata, never via add_component/modify_component.
9. When the user shares a URL, use fetch_url to analyze it and suggest content.
10. When the user shares an image, analyze it and suggest how to incorporate it.
11. Be concise in your responses. Describe what you did after making changes.
12. When creating a full page, build it section by section for a professional layout.
13. Respect each component's description and guidelines - do not misuse a component outside its intended purpose.`;
}
