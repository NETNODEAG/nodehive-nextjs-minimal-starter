import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createServerClient } from '@/nodehive/client';
import { Locale } from '@/nodehive/i18n-config';
import { spaceConfig } from '@/nodehive/space-config';
import { DrupalNode } from '@/nodehive/types';

import { absoluteUrl } from '@/lib/utils';
import Node from '@/components/node/Node';
import SmartActionsButton from '@/components/nodehive/smart-actions/SmartActionsButton';

interface PageProps {
  params: Promise<{ slug: Array<string>; lang: Locale }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug, lang } = await props.params;
  const client = await createServerClient();

  // Join the slug array into a string
  const slugString = slug.join('/');

  // Retrieve a resource, utilizing its unique slug as the identifier
  const entity = await client.getResourceBySlug(slugString, lang);
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

export default async function Page(props: PageProps) {
  const params = await props.params;
  const client = await createServerClient();

  const { slug, lang } = params;

  // Redirect to the 404 page using the notFound() function if no slug is received
  if (!slug) {
    notFound();
  }

  // Join the slug array into a string
  const slugString = slug.join('/');

  // Retrieve a resource, utilizing its unique slug as the identifier
  const entity = await client.getResourceBySlug(slugString, lang);

  // Redirect to the 404 page using the notFound() function if no entity is received
  if (!entity) {
    notFound();
  }

  // Node data
  const node = entity?.data;
  const aliasPath = node?.path?.alias;
  const aliasLang = node?.langcode || lang;

  // Redirect to the aliased path if it differs from the current slug
  if (aliasPath && aliasPath !== `/${slug.join('/')}`) {
    redirect('/' + aliasLang + aliasPath);
  }

  return (
    <>
      <Node node={node as DrupalNode} />

      <SmartActionsButton lang={lang} />
    </>
  );
}
