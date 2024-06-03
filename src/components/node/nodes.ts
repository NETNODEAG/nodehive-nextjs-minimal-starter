import { FunctionComponent } from 'react';

import NodePage, { NodePageProps } from './page/NodePage';

interface NodePropMap {
  'node--page': NodePageProps;
}

type NodeTypes = {
  [K in keyof NodePropMap]: FunctionComponent<NodePropMap[K]>;
};

export function isNodeType(key: string): key is keyof NodeTypes {
  return key in nodeTypes;
}

export const nodeTypes: NodeTypes = {
  'node--page': NodePage,
};
