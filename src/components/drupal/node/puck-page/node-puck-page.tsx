import { DrupalNode } from '@/types/nodehive';
import { createUserClient } from '@/lib/nodehive-client';
import PuckPage from '@/components/drupal/node/puck-page/puck-page';
import Debug from '@/components/ui/atoms/debug/debug';

export interface NodePuckPageProps {
  node: DrupalNode;
}

export default async function NodePuckPage({ node }: NodePuckPageProps) {
  const client = createUserClient();
  const isLoggedIn = await client.auth.isLoggedIn();
  return (
    <div data-node-type="puck-page">
      <Debug data={node} />
      <PuckPage
        isLoggedIn={isLoggedIn}
        node={node}
        fieldName="field_puck_data"
      />
    </div>
  );
}
