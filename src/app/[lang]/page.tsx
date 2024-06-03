import { notFound } from 'next/navigation';
import { createServerClient } from '@/nodehive/client';
import SmartActionsButton from '@/nodehive/components/smart-actions/smart-actions-button';
import { Locale } from '@/nodehive/i18n-config';
import { DrupalNode } from '@/nodehive/types';

import Node from '@/components/node/Node';

interface RootPageProps {
  params: {
    lang: Locale;
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
