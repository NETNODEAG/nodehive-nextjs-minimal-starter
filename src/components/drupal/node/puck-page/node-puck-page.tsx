import { DrupalNode } from '@/types/nodehive';
import PuckPage from '@/components/drupal/node/puck-page/puck-page';
import Debug from '@/components/ui/atoms/debug/debug';

export interface NodePuckPageProps {
  node: DrupalNode;
}

export default function NodePuckPage({ node }: NodePuckPageProps) {
  return (
    <div data-node-type="puck-page">
      <Debug data={node} />
      <PuckPage node={node} fieldName="field_puck_data" />
    </div>
  );
}
