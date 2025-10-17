'use client';

import { DrupalNode } from '@/nodehive/types';

import PuckWrapper from '@/components/puck/puck-wrapper';
import config from '@/components/puck/puck.page.config';

interface PuckLandingPageProps {
  node: DrupalNode;
  fieldName: string;
}

export default function PuckLandingPage({
  node,
  fieldName,
}: PuckLandingPageProps) {
  return <PuckWrapper node={node} fieldName={fieldName} config={config} />;
}
