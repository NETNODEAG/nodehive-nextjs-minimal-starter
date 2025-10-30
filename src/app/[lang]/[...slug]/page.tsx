import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import getPage from '@/data/nodehive/page/get-page';

import { DrupalNode } from '@/types/nodehive';
import { i18n, Locale } from '@/config/i18n-config';
import { spaceConfig } from '@/config/space-config';
import { absoluteUrl } from '@/lib/utils';
import Node from '@/components/drupal/node/node';
import SmartActionsButton from '@/components/nodehive/smart-actions/smart-actions-button';

interface PageProps {
  params: Promise<{ slug: Array<string>; lang: Locale }>;
}

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug, lang } = await props.params;

  const slugString = slug.join('/');

  const entity = await getPage(slugString, lang);
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
  const { slug, lang } = params;

  if (!slug) {
    notFound();
  }

  const slugString = slug.join('/');

  const entity = await getPage(slugString, lang);

  if (!entity) {
    notFound();
  }

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
