import { DrupalNode } from '@/nodehive/types';

export interface NodeStoryCollectionProps {
  node: DrupalNode;
}

export default function NodeStoryCollection({
  node,
}: NodeStoryCollectionProps) {
  console.log(node);
  return (
    <div>
      <pre className="mt-8">{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
}
