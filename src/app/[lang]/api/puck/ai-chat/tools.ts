import { createOpenAI } from '@ai-sdk/openai';
import { Config } from '@puckeditor/core';
import { generateObject, tool } from 'ai';
import TurndownService from 'turndown';
import { z } from 'zod';

import { serializeComponentSpec } from '@/components/puck/plugins/ai-chat-plugin/utils/build-system-prompt';
import { generateId } from '@/components/puck/utils';

type PuckData = {
  content: Array<{ type: string; props: Record<string, any> }>;
  [key: string]: any;
};

type ToolsContext = {
  puckConfig: Config;
  puckData: PuckData;
  lang: string;
};

export function createAiChatTools({
  puckConfig,
  puckData,
  lang,
}: ToolsContext) {
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

    set_page_content: tool({
      description:
        'Replace the entire page content with new components. Use this when creating a full page or replacing all content.',
      inputSchema: z.object({
        content: z
          .array(
            z.object({
              type: z
                .string()
                .describe(
                  'Component type name (e.g., "Hero", "Container", "Heading")'
                ),
              props: z
                .record(z.string(), z.any())
                .describe('Component props matching the field definitions'),
            })
          )
          .describe('Array of components to set as page content'),
      }),
      execute: async ({ content }) => {
        const contentWithIds = content.map((component) => ({
          ...component,
          props: {
            ...component.props,
            id: generateId(component.type),
          },
        }));

        return {
          puckData: {
            ...puckData,
            content: contentWithIds,
          },
          message: `Set page content with ${content.length} component(s)`,
        };
      },
    }),

    modify_component: tool({
      description:
        'Modify a specific component by its ID. Merges new props with existing ones.',
      inputSchema: z.object({
        componentId: z
          .string()
          .describe('The component ID to modify (from current page data)'),
        newProps: z
          .record(z.string(), z.any())
          .describe('Props to update (merged with existing)'),
      }),
      execute: async ({ componentId, newProps }) => {
        const newContent = puckData.content.map((component) => {
          if (component.props.id === componentId) {
            return {
              ...component,
              props: {
                ...component.props,
                ...newProps,
              },
            };
          }
          return component;
        });

        return {
          puckData: {
            ...puckData,
            content: newContent,
          },
          message: `Modified component ${componentId}`,
        };
      },
    }),

    add_component: tool({
      description: 'Add a new component at a specific position in the page.',
      inputSchema: z.object({
        type: z
          .string()
          .describe('Component type name (e.g., "Heading", "Hero")'),
        props: z
          .record(z.string(), z.any())
          .describe('Component props matching the field definitions'),
        index: z
          .number()
          .optional()
          .describe(
            'Position to insert at (0-based). Omit to append at the end.'
          ),
      }),
      execute: async ({ type, props, index }) => {
        const newComponent = {
          type,
          props: {
            ...props,
            id: generateId(type),
          },
        };

        const newContent = [...puckData.content];
        if (index !== undefined && index >= 0) {
          newContent.splice(index, 0, newComponent);
        } else {
          newContent.push(newComponent);
        }

        return {
          puckData: {
            ...puckData,
            content: newContent,
          },
          message: `Added ${type} component`,
        };
      },
    }),

    remove_component: tool({
      description: 'Remove a component from the page by its ID.',
      inputSchema: z.object({
        componentId: z
          .string()
          .describe('The component ID to remove (from current page data)'),
      }),
      execute: async ({ componentId }) => {
        const newContent = puckData.content.filter(
          (component) => component.props.id !== componentId
        );

        return {
          puckData: {
            ...puckData,
            content: newContent,
          },
          message: `Removed component ${componentId}`,
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
