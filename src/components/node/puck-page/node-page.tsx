import { DrupalNode } from '@/types/nodehive';
import PuckPage from '@/components/puck/page/puck-page';

export interface NodePuckPageProps {
  node: DrupalNode;
}

export default function NodePuckPage({ node }: NodePuckPageProps) {
  return <PuckPage node={node} fieldName="field_puck_data" />;
}
