import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { z } from 'zod';

import { buildSystemPrompt } from '@/components/puck/plugins/ai-chat-plugin/utils/build-system-prompt';
import { generateId } from '@/components/puck/utils';

interface RouteParams {
  params: Promise<{
    lang: string;
  }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { lang } = await params;

  const body = await request.json();
  const {
    messages,
    puckConfig,
    puckData,
  }: {
    messages: UIMessage[];
    puckConfig: string;
    puckData: string;
  } = body;

  let parsedConfig;
  let parsedPuckData;
  try {
    parsedConfig = JSON.parse(puckConfig);
    parsedPuckData = JSON.parse(puckData);
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON data provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const systemPrompt = buildSystemPrompt(parsedConfig, parsedPuckData);

  const openai = createOpenAI({
    apiKey: process.env.AI_API_KEY,
  });

  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      set_page_content: {
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
        execute: async ({
          content,
        }: {
          content: Array<{ type: string; props: Record<string, any> }>;
        }) => {
          const contentWithIds = content.map(
            (component: { type: string; props: Record<string, any> }) => ({
              ...component,
              props: {
                ...component.props,
                id: generateId(component.type),
              },
            })
          );

          return {
            puckData: {
              ...parsedPuckData,
              content: contentWithIds,
            },
            message: `Set page content with ${content.length} component(s)`,
          };
        },
      },

      modify_component: {
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
        execute: async ({
          componentId,
          newProps,
        }: {
          componentId: string;
          newProps: Record<string, any>;
        }) => {
          const newContent = parsedPuckData.content.map((component: any) => {
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
              ...parsedPuckData,
              content: newContent,
            },
            message: `Modified component ${componentId}`,
          };
        },
      },

      add_component: {
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
        execute: async ({
          type,
          props,
          index,
        }: {
          type: string;
          props: Record<string, any>;
          index?: number;
        }) => {
          const newComponent = {
            type,
            props: {
              ...props,
              id: generateId(type),
            },
          };

          const newContent = [...parsedPuckData.content];
          if (index !== undefined && index >= 0) {
            newContent.splice(index, 0, newComponent);
          } else {
            newContent.push(newComponent);
          }

          return {
            puckData: {
              ...parsedPuckData,
              content: newContent,
            },
            message: `Added ${type} component`,
          };
        },
      },

      remove_component: {
        description: 'Remove a component from the page by its ID.',
        inputSchema: z.object({
          componentId: z
            .string()
            .describe('The component ID to remove (from current page data)'),
        }),
        execute: async ({ componentId }: { componentId: string }) => {
          const newContent = parsedPuckData.content.filter(
            (component: any) => component.props.id !== componentId
          );

          return {
            puckData: {
              ...parsedPuckData,
              content: newContent,
            },
            message: `Removed component ${componentId}`,
          };
        },
      },

      search_media: {
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
        execute: async ({
          type,
          query,
          limit,
        }: {
          type: string;
          query?: string;
          limit: number;
        }) => {
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
      },

      fetch_url: {
        description:
          'Fetch and analyze the content of a URL. Use this when the user shares a link and wants to create content based on it.',
        inputSchema: z.object({
          url: z.string().url().describe('The URL to fetch and analyze'),
        }),
        execute: async ({ url }: { url: string }) => {
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

            const textContent = html
              .replace(
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                ''
              )
              .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 5000);

            const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : '';

            const descMatch = html.match(
              /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i
            );
            const description = descMatch ? descMatch[1].trim() : '';

            return { url, title, description, content: textContent };
          } catch {
            return { url, error: 'Failed to fetch URL' };
          }
        },
      },
    },
    stopWhen: (event) => event.steps.length >= 5,
  });

  return result.toUIMessageStreamResponse();
}
