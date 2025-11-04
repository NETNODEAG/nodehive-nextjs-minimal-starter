'use client';

import { DrupalNode } from '@/types/nodehive';
import config from '@/components/drupal/node/puck-page/puck.page.config';
import PuckWrapper from '@/components/puck/puck-wrapper';

interface PuckPageProps {
  node: DrupalNode;
  fieldName: string;
  isLoggedIn: boolean;
}

export default function PuckPage({
  isLoggedIn,
  node,
  fieldName,
}: PuckPageProps) {
  return (
    <PuckWrapper
      isLoggedIn={isLoggedIn}
      node={node}
      fieldName={fieldName}
      config={config}
    />
  );
}
