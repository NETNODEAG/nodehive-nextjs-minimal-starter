import { createOpenAI } from '@ai-sdk/openai';
import { ComponentData, Config } from '@puckeditor/core';
import { generateObject, tool } from 'ai';
import TurndownService from 'turndown';
import { z } from 'zod';

import { serializeComponentSpec } from '@/components/puck/plugins/ai-chat-plugin/utils/build-system-prompt';
import { generateTemplateIds } from '@/components/puck/utils';

const ROOT_ZONE = 'root:default-zone';

type ToolsContext = {
  puckConfig: Config;
  lang: string;
};

function resolveZone(
  destinationId: string | undefined,
  destinationSlot: string | undefined
): string {
  if (!destinationId || destinationId === 'root') return ROOT_ZONE;
  return `${destinationId}:${destinationSlot || 'content'}`;
}

export function createAiChatTools({ puckConfig, lang }: ToolsContext) {
  return {
    get_component_spec: tool({
      description:
        'Get the full specification for a component (description, guidelines, fields with hints, default props). Call this before adding or modifying a component to avoid guessing fields or values.',
      inputSchema: z.object({
        name: z
          .string()
          .describe(
            'Component type name from the AVAILABLE COMPONENTS list (e.g., "Hero", "Container")'
          ),
      }),
      execute: async ({ name }) => {
        const spec = serializeComponentSpec(name, puckConfig);
        if (!spec) {
          return {
            error: `Component "${name}" not found in config. Check the AVAILABLE COMPONENTS list.`,
          };
        }
        return { name, spec };
      },
    }),

    add_component: tool({
      description:
        'Add a new component at the root of the page or inside a parent component slot. Emits a patch that the editor applies incrementally — the page updates immediately with no flash.',
      inputSchema: z.object({
        type: z
          .string()
          .describe('Component type name (e.g., "Heading", "Hero")'),
        props: z
          .record(z.string(), z.any())
          .describe(
            'Component props matching the field definitions. For nested slots, fill slot arrays recursively — child components get IDs auto-generated.'
          ),
        destinationId: z
          .string()
          .optional()
          .describe(
            'Parent component ID to nest inside. Omit or set to "root" for top-level.'
          ),
        destinationSlot: z
          .string()
          .optional()
          .describe(
            'Slot field name on the parent (e.g., "content", "leftColumn"). Required when destinationId is set (other than "root").'
          ),
        destinationIndex: z
          .number()
          .optional()
          .describe(
            'Position within the destination (0-based). Omit to append at the end.'
          ),
      }),
      execute: async ({
        type,
        props,
        destinationId,
        destinationSlot,
        destinationIndex,
      }) => {
        const [component] = generateTemplateIds(
          [{ type, props } as ComponentData],
          puckConfig
        );
        const zone = resolveZone(destinationId, destinationSlot);
        return {
          action: 'add' as const,
          id: component.props.id,
          component,
          destinationZone: zone,
          destinationIndex: destinationIndex ?? -1,
          message: `Added ${type}${destinationId && destinationId !== 'root' ? ` into ${destinationId}:${destinationSlot}` : ''}`,
        };
      },
    }),

    modify_component: tool({
      description:
        'Modify a specific component by its ID. Merges new props with existing ones. Emits a patch — only the affected component re-renders.',
      inputSchema: z.object({
        componentId: z
          .string()
          .describe('The component ID to modify (from current page data)'),
        newProps: z
          .record(z.string(), z.any())
          .describe('Props to update (merged with existing)'),
      }),
      execute: async ({ componentId, newProps }) => {
        // Strip any id the model may have included; the id must not change.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _ignored, ...safeProps } = newProps;
        return {
          action: 'modify' as const,
          id: componentId,
          newProps: safeProps,
          message: `Modified ${componentId}`,
        };
      },
    }),

    remove_component: tool({
      description:
        'Remove a component from the page by its ID. Emits a patch — only the affected zone re-renders.',
      inputSchema: z.object({
        componentId: z
          .string()
          .describe('The component ID to remove (from current page data)'),
      }),
      execute: async ({ componentId }) => {
        return {
          action: 'remove' as const,
          id: componentId,
          message: `Removed ${componentId}`,
        };
      },
    }),

    set_page_metadata: tool({
      description:
        'Update page-level metadata (SEO title, description, URL alias, published state, OG image). See PAGE METADATA FIELDS in the system prompt for the exact field names. Pass only the fields you want to change — others stay untouched.',
      inputSchema: z.object({
        fields: z
          .record(z.string(), z.any())
          .describe(
            'Partial root props to merge. Field names must match the PAGE METADATA FIELDS list exactly.'
          ),
      }),
      execute: async ({ fields }) => {
        return {
          action: 'setRoot' as const,
          fields,
          message: `Updated page metadata (${Object.keys(fields).join(', ')})`,
        };
      },
    }),

    search_media: tool({
      description:
        'Search the Drupal media library for images, videos, documents, or audio files. Use this to find existing media that can be used in components.',
      inputSchema: z.object({
        type: z
          .enum(['image', 'remote_video', 'document', 'audio'])
          .describe('Type of media to search for'),
        query: z
          .string()
          .optional()
          .describe('Search query to filter media items'),
        limit: z
          .number()
          .optional()
          .default(10)
          .describe('Maximum number of results to return'),
      }),
      execute: async ({ type, query, limit }) => {
        try {
          const searchParams = new URLSearchParams();
          if (query) searchParams.set('query', query);
          searchParams.set('limit', String(limit));

          const baseUrl =
            process.env.NEXT_PUBLIC_FRONTEND_BASE_URL ||
            'http://localhost:3000';
          const response = await fetch(
            `${baseUrl}/${lang}/api/puck/media/${type}?${searchParams}`,
            { headers: { 'Content-Type': 'application/json' } }
          );

          if (!response.ok) {
            return { results: [], message: 'Failed to search media' };
          }

          const data = await response.json();
          const items = (data.data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            thumbnailUrl: item.thumbnail?.uri?.url
              ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${item.thumbnail.uri.url}`
              : null,
            fileUrl: item.field_media_image?.uri?.url
              ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${item.field_media_image.uri.url}`
              : null,
          }));

          return {
            results: items,
            message: `Found ${items.length} ${type} item(s)`,
          };
        } catch {
          return { results: [], message: 'Error searching media' };
        }
      },
    }),

    fetch_url: tool({
      description:
        'Fetch a URL and return a structured analysis of the page (title, description, section layout, CTAs, key images). Use this when the user shares a link and wants to create content based on it. Note: JavaScript is NOT executed — pages rendered client-side (SPAs) may return empty content.',
      inputSchema: z.object({
        url: z.string().url().describe('The URL to fetch and analyze'),
      }),
      execute: async ({ url }) => {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; PuckAI/1.0)',
            },
            signal: AbortSignal.timeout(10000),
          });

          if (!response.ok) {
            return {
              url,
              error: `Failed to fetch: HTTP ${response.status}`,
            };
          }

          const html = await response.text();

          // HTML → Markdown (preserves heading hierarchy, links, images, lists)
          const turndown = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
          });
          turndown.remove([
            'script',
            'style',
            'noscript',
            'iframe',
            'svg' as 'script',
          ]);

          // Extract <title> and <meta description> before conversion
          const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
          const pageTitle = titleMatch ? titleMatch[1].trim() : '';

          const descMatch = html.match(
            /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i
          );
          const metaDescription = descMatch ? descMatch[1].trim() : '';

          const markdown = turndown.turndown(html).slice(0, 15000);

          // Detect empty/SPA shell early
          if (markdown.trim().length < 100) {
            return {
              url,
              title: pageTitle,
              description: metaDescription,
              warning:
                'Very little content found — this page may be rendered client-side (SPA) and cannot be analyzed without a headless browser.',
              markdown,
            };
          }

          // Structured extraction pass with a fast model
          const openai = createOpenAI({ apiKey: process.env.AI_API_KEY });

          const { object } = await generateObject({
            model: openai('gpt-5.4'),
            schema: z.object({
              purpose: z
                .string()
                .describe('One-sentence summary of what this page is about'),
              sections: z
                .array(
                  z.object({
                    type: z
                      .string()
                      .describe(
                        'Section role (e.g., hero, features, pricing, testimonials, faq, cta, footer)'
                      ),
                    heading: z.string().optional(),
                    summary: z
                      .string()
                      .describe('Short summary of the section content'),
                  })
                )
                .describe('Detected page sections in order'),
              ctas: z
                .array(
                  z.object({
                    text: z.string(),
                    url: z.string().optional(),
                  })
                )
                .describe('Primary call-to-action buttons/links'),
              keyImages: z
                .array(
                  z.object({
                    alt: z.string(),
                    url: z.string(),
                  })
                )
                .describe(
                  'Important content images (skip icons, logos, decorative images)'
                ),
            }),
            system:
              'You analyze webpages for a page-builder AI. Extract layout structure, CTAs, and key images from the given markdown.',
            prompt: `URL: ${url}\nTitle: ${pageTitle}\nDescription: ${metaDescription}\n\nMarkdown content:\n${markdown}`,
          });

          return {
            url,
            title: pageTitle,
            description: metaDescription,
            ...object,
          };
        } catch (error) {
          return {
            url,
            error:
              error instanceof Error ? error.message : 'Failed to fetch URL',
          };
        }
      },
    }),
  };
}
