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
  params: {
    lang: Locale;
  };
}

export async function generateMetadata({
  params,
}: RootPageProps): Promise<Metadata> {
  const client = createServerClient();

  const { lang } = params;

  // Retrieve a resource, utilizing its unique slug as the identifier
  const entity = await client.getResourceBySlug(
    process.env.NODEHIVE_STARTPAGE_SLUG,
    lang
  );

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

export default async function RootPage({ params }: RootPageProps) {
  const client = createServerClient();

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

  return (
    <>
      {/* TODO: Fix the types correctly */}
      <Node node={entity as unknown as DrupalNode} />

      <SmartActionsButton />
    </>
  );
}
