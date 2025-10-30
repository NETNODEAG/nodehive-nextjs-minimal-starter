'use client';

import { DrupalNode } from '@/types/nodehive';
import config from '@/components/node/puck-page/puck.page.config';
import PuckWrapper from '@/components/puck/puck-wrapper';

interface PuckPageProps {
  node: DrupalNode;
  fieldName: string;
}

export default function PuckPage({ node, fieldName }: PuckPageProps) {
  return <PuckWrapper node={node} fieldName={fieldName} config={config} />;
}
