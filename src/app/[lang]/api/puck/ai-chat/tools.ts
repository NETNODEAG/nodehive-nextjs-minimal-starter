import { ComponentData, Config, Data } from '@puckeditor/core';
import { tool } from 'ai';
import TurndownService from 'turndown';
import { z } from 'zod';

import { serializeComponentSpec } from '@/components/puck/plugins/ai-chat-plugin/utils/build-system-prompt';
import { findComponentLocation } from '@/components/puck/plugins/ai-chat-plugin/utils/find-component-location';
import { generateTemplateIds } from '@/components/puck/utils';

const ROOT_ZONE = 'root:default-zone';

type ToolsContext = {
  puckConfig: Config;
  puckData: Data;
  lang: string;
};

function resolveZone(
  destinationId: string | undefined,
  destinationSlot: string | undefined
): string {
  if (!destinationId || destinationId === 'root') return ROOT_ZONE;
  return `${destinationId}:${destinationSlot || 'content'}`;
}

export function createAiChatTools({
  puckConfig,
  puckData,
  lang,
}: ToolsContext) {
  return {
    ask_user_questions: tool({
      description:
        "Ask the user one or more clarifying questions when requirements are ambiguous AND you cannot make a reasonable assumption. The client renders the questions as tabs the user can step through. Every question MUST have a short tab title (1-3 words, e.g. 'Page type', 'Audience', 'Layout'), 2-4 radio-button suggestions, and always shows a free-text 'Other' input. Mark exactly ONE option per question as `recommended: true` — your best guess given the context; it gets a '(recommended)' badge (nothing is pre-selected — the user always picks). Use sparingly — for genuinely blocking ambiguity only; for minor decisions pick a sensible default and mention it in your reply. The tool result is an array of { question, label, value } where `value` is the structured answer (use this to act) and `label` is the human-readable text the user saw (use it when referring back to the user's choice in your reply).",
      inputSchema: z.object({
        questions: z
          .array(
            z.object({
              title: z
                .string()
                .describe(
                  'Short tab title, 1-3 words (e.g. "Page type", "Audience", "Layout"). Shown on the tab button.'
                ),
              question: z
                .string()
                .describe('The full question text shown to the user'),
              options: z
                .array(
                  z.object({
                    label: z
                      .string()
                      .describe(
                        'Short human-readable label for the radio button'
                      ),
                    value: z
                      .string()
                      .describe(
                        'The value returned to you when this option is selected'
                      ),
                    recommended: z
                      .boolean()
                      .optional()
                      .describe(
                        'Mark exactly one option per question as the recommended default. It gets a "(recommended)" badge but is NOT pre-selected — the user always makes an explicit choice.'
                      ),
                  })
                )
                .min(2)
                .max(6)
                .describe('Suggested answers as radio options (2-6)'),
            })
          )
          .min(1)
          .max(5)
          .describe(
            'Questions to ask — each shown as a tab. Keep to 1-3 for best UX.'
          ),
      }),
      // No `execute` — this is a client-handled tool. The chat UI renders the
      // questions, the user answers, and the client calls addToolOutput() to
      // return the answers to the model.
    }),

    get_page: tool({
      description:
        'Get the full current page data — every component with full props, plus root-level page metadata. Heavier than get_component; use this only when you need a complete snapshot (e.g. analyzing the whole page, bulk operations). Prefer get_component(id) for single-component reads.',
      inputSchema: z.object({}),
      execute: async () => {
        return { data: puckData };
      },
    }),

    get_component: tool({
      description:
        'Get the current props of a component on the page by its ID. Use this when you need to read existing values before modifying a component (e.g. to append to an array field or change one prop without clobbering others). IDs come from the CURRENT PAGE STRUCTURE tree.',
      inputSchema: z.object({
        componentId: z
          .string()
          .describe(
            'The component ID from the CURRENT PAGE STRUCTURE tree (e.g., "HeroSection-abc123")'
          ),
      }),
      execute: async ({ componentId }) => {
        const location = findComponentLocation(
          puckData,
          puckConfig,
          componentId
        );
        if (!location) {
          return {
            error: `Component "${componentId}" not found in the current page.`,
          };
        }
        return {
          id: componentId,
          type: location.component.type,
          props: location.component.props,
        };
      },
    }),

    get_component_spec: tool({
      description:
        'Get the full specification for a component (description, guidelines, fields with hints, default props). Call this before adding or modifying a component to avoid guessing fields or values.',
      inputSchema: z.object({
        name: z
          .string()
          .describe(
            'Component type name from the AVAILABLE COMPONENTS list (e.g., "HeroSection", "Container")'
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
          .describe('Component type name (e.g., "Heading", "HeroSection")'),
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
        'Fetch a URL and return its content as Markdown (plus title and meta description). Use this when the user shares a link and wants to create or adapt content based on it. Read the returned markdown yourself to identify sections, headings, body copy, CTAs, and images, then build the page with add_component calls using that content as the source. Note: JavaScript is NOT executed — pages rendered client-side (SPAs) may return very little content.',
      inputSchema: z.object({
        url: z.string().url().describe('The URL to fetch'),
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

          const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
          const title = titleMatch ? titleMatch[1].trim() : '';

          const descMatch = html.match(
            /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i
          );
          const description = descMatch ? descMatch[1].trim() : '';

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

          const markdown = turndown.turndown(html).slice(0, 15000);

          if (markdown.trim().length < 100) {
            return {
              url,
              title,
              description,
              warning:
                'Very little content found — this page may be rendered client-side (SPA) and cannot be analyzed without a headless browser.',
              markdown,
            };
          }

          return { url, title, description, markdown };
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
