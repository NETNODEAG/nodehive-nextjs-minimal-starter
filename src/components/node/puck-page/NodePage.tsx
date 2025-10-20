import { DrupalNode } from '@/nodehive/types';

import PuckPage from '@/components/puck/page/PuckPage';

export interface NodePuckPageProps {
  node: DrupalNode;
}

export default function NodePuckPage({ node }: NodePuckPageProps) {
  return <PuckPage node={node} fieldName="field_puck_data" />;
}
