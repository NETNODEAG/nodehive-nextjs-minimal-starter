import { DrupalNode } from '@/nodehive/types';

export interface NodeStoryProps {
  node: DrupalNode;
}

export default function NodeStory({ node }: NodeStoryProps) {
  return <div>Node Story</div>;
}
