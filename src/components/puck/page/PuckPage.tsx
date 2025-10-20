'use client';

import { DrupalNode } from '@/nodehive/types';

import config from '@/components/puck/page/puck.page.config';
import PuckWrapper from '@/components/puck/PuckWrapper';

interface PuckPageProps {
  node: DrupalNode;
  fieldName: string;
}

export default function PuckPage({ node, fieldName }: PuckPageProps) {
  return <PuckWrapper node={node} fieldName={fieldName} config={config} />;
}
