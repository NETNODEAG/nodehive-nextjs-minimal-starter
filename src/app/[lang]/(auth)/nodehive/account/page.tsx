import Link from 'next/link';
import { redirect } from 'next/navigation';
import { logout } from '@/data/auth/server';
import { getUser } from '@/nodehive/auth';
import { createServerClient } from '@/nodehive/client';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

async function getSpaceNodes(language: string) {
  const spaceId = process.env.NEXT_PUBLIC_DRUPAL_NODEHIVE_SPACE_ID;

  if (!spaceId) {
    return [];
  }

  try {
    const client = await createServerClient();
    const apiParams = new DrupalJsonApiParams();

    // Filter nodes by space ID
    apiParams.addFilter(
      'nodehive_space.meta.drupal_internal__target_id',
      spaceId
    );

    // Add fields to include title and changed date
    apiParams.addFields('node--page', [
      'title',
      'changed',
      'drupal_internal__nid',
      'path',
      'langcode',
    ]);
    apiParams.addFields('node--article', [
      'title',
      'changed',
      'drupal_internal__nid',
      'path',
      'langcode',
    ]);
    apiParams.addFields('node--puck_page', [
      'title',
      'changed',
      'drupal_internal__nid',
      'path',
      'langcode',
    ]);

    // Sort by last edit date (most recent first)
    apiParams.addSort('changed', 'DESC');

    // Get all content types - we'll try common ones
    const pageNodes = await client
      .getNodes('page', { lang: language, params: apiParams })
      .catch(() => ({ data: [] }));
    const articleNodes = await client
      .getNodes('article', { lang: language, params: apiParams })
      .catch(() => ({ data: [] }));
    const puckPageNodes = await client
      .getNodes('puck_page', { lang: language, params: apiParams })
      .catch(() => ({ data: [] }));

    const allNodes = [
      ...(pageNodes?.data || []),
      ...(articleNodes?.data || []),
      ...(puckPageNodes?.data || []),
    ];

    // Sort all nodes by changed date
    allNodes.sort((a: any, b: any) => {
      const dateA = new Date(a.changed).getTime();
      const dateB = new Date(b.changed).getTime();
      return dateB - dateA;
    });

    return allNodes;
  } catch (error) {
    console.error('Error fetching space nodes:', error);
    return [];
  }
}

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { lang } = params;

  const user = await getUser();

  if (!user) {
    redirect('/nodehive/login');
  }

  const name = user?.name?.[0]?.value;
  const email = user?.mail?.[0]?.value;
  const nodes = await getSpaceNodes(lang);

  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;
  const spaceId = process.env.NEXT_PUBLIC_DRUPAL_NODEHIVE_SPACE_ID;
  const spaceOverviewUrl = `${baseUrl}/${lang}/space/${spaceId}`;
  const spaceCreateUrl = `${baseUrl}/${lang}/space/${spaceId}/create`;

  return (
    <section className="container-wrapper space-y-8 py-16">
      <h1>Account</h1>

      <div className="space-y-4">
        <ul>
          <li>
            <strong>Username:</strong> {name}
          </li>
          <li>
            <strong>Email:</strong> {email}
          </li>
          <li className="mt-8">
            <form action={logout}>
              <button type="submit" className="text-sm font-bold uppercase">
                Logout
              </button>
            </form>
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Your Space Nodes</h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={spaceOverviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Manage Space
            </a>
            <a
              href={spaceCreateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Node
            </a>
          </div>
        </div>

        {nodes.length > 0 ? (
          <div className="grid gap-4">
            {nodes.map((node: any) => {
              const lastEdited = new Date(node.changed).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              );

              const nodePath = node.path?.alias
                ? `/${node.path.langcode}${node.path.alias}`
                : `/${node.langcode}/node/${node.drupal_internal__nid}`;

              const contentType = node.type?.replace('node--', '') || 'unknown';

              return (
                <Link key={node.id} href={nodePath} className="group block">
                  <div className="rounded-lg border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-400 hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                          {node.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 capitalize">
                            {contentType.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            Updated {lastEdited}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-gray-400 transition-colors group-hover:text-gray-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4 text-gray-500">No nodes found in this space.</p>
          </div>
        )}
      </div>
    </section>
  );
}
