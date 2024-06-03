import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/nodehive/client';
import SmartActionsButton from '@/nodehive/components/smart-actions/smart-actions-button';
import { spaceConfig } from '@/nodehive/space-config';
import { DrupalNode } from '@/nodehive/types';

import { absoluteUrl } from '@/lib/utils';
import Node from '@/components/node/Node';

interface PageProps {
  params: { slug: Array<string> };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const client = createServerClient();
  const { slug } = params;

  // Join the slug array into a string
  const slugString = slug.join('/');

  // Retrieve a resource, utilizing its unique slug as the identifier
  const entity = await client.getResourceBySlug(slugString);

  const { spaceMetadata } = spaceConfig;

  // Drupal metadata
  const entityData = entity?.data;
  const title = entityData?.title;
  const teaser = entityData?.field_teaser?.value;
  const image = entityData?.field_media?.field_media_image?.uri?.url;

  // SEO metadata
  let seoTitle = title || spaceMetadata.openGraph.title;
  let seoDescription = teaser || spaceMetadata.openGraph.description;
  let seoImage = image ? absoluteUrl(image) : spaceMetadata.ogImage;

  return {
    title: {
      template: spaceMetadata.title.template,
      default: seoTitle,
    },
    description: seoDescription,
    openGraph: {
      siteName: spaceMetadata.openGraph.siteName,
      title: seoTitle,
      description: seoDescription,
      locale: 'en',
      type: 'website',
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const client = createServerClient();

  const { slug } = params;

  // Redirect to the 404 page using the notFound() function if no slug is received
  if (!slug) {
    notFound();
  }

  // Join the slug array into a string
  const slugString = slug.join('/');

  // Retrieve a resource, utilizing its unique slug as the identifier
  const entity = await client.getResourceBySlug(slugString);

  // Redirect to the 404 page using the notFound() function if no entity is received
  if (!entity) {
    notFound();
  }

  return (
    <>
      {/* TODO: Fix the types correctly */}
      <Node node={entity as unknown as DrupalNode} />

      <SmartActionsButton />

      {
        <details className="container mx-auto mb-10 mt-10 rounded-md bg-black p-8 px-4 text-xs text-slate-50">
          <summary className="cursor-pointer font-bold">
            API JSON Output
          </summary>
          <pre className="mt-8">{JSON.stringify(entity, null, 2)}</pre>
        </details>
      }
    </>
  );
}
