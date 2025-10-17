import { FunctionComponent } from 'react';

import NodeStoryCollection, {
  NodeStoryCollectionProps,
} from './story-collection/NodeStoryCollection';

interface NodePropMap {
  'node--story_collection': NodeStoryCollectionProps;
}

type NodeTypes = {
  [K in keyof NodePropMap]: FunctionComponent<NodePropMap[K]>;
};

export function isNodeType(key: string): key is keyof NodeTypes {
  return key in nodeTypes;
}

export const nodeTypes: NodeTypes = {
  'node--story_collection': NodeStoryCollection,
};
