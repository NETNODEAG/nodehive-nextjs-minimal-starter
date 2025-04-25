import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/nodehive/client';
import SmartActionsButton from '@/nodehive/components/smart-actions/smart-actions-button';
import { Locale } from '@/nodehive/i18n-config';
import { spaceConfig } from '@/nodehive/space-config';
import { DrupalNode } from '@/nodehive/types';

import { absoluteUrl } from '@/lib/utils';
import Node from '@/components/node/Node';

interface RootPageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

export async function generateMetadata(
  props: RootPageProps
): Promise<Metadata> {
  const params = await props.params;
  const client = await createServerClient();

  const { lang } = params;

  // Retrieve a resource, utilizing its unique slug as the identifier
  const entity = await client.getResourceBySlug(
    process.env.NODEHIVE_STARTPAGE_SLUG,
    lang
  );
  const node = entity?.data;

  const { spaceMetadata } = spaceConfig;

  // Default metadata
  let seoTitle = spaceMetadata.openGraph.title;
  let seoDescription = spaceMetadata.openGraph.description;
  let seoImage = spaceMetadata.ogImage;

  // Drupal metadata
  const title = node?.title;
  const teaser = node?.field_teaser?.value;
  const image = node?.field_media?.field_media_image?.uri?.url;

  if (title) seoTitle = title;
  if (teaser) seoDescription = teaser;
  if (image) seoImage = absoluteUrl(image);

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
      locale: lang,
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
    robots: {
      follow: true,
      index: true,
    },
  };
}

export default async function RootPage(props: RootPageProps) {
  const params = await props.params;
  const client = await createServerClient();

  const { lang } = params;

  // Retrieve a resource, utilizing its unique slug as the identifier
  const entity = await client.getResourceBySlug(
    process.env.NODEHIVE_STARTPAGE_SLUG,
    lang
  );

  // Redirect to the 404 page using the notFound() function if no entity is received
  if (!entity) {
    notFound();
  }

  // Node data
  const node = entity?.data;

  return (
    <>
      <Node node={node as DrupalNode} />

      <SmartActionsButton />
    </>
  );
}
