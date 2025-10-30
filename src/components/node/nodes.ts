import { FunctionComponent } from 'react';

import NodePage, { NodePageProps } from '@/components/node/page/node-page';
import NodePuckPage, {
  NodePuckPageProps,
} from '@/components/node/puck-page/node-puck-page';

interface NodePropMap {
  'node--page': NodePageProps;
  'node--puck_page': NodePuckPageProps;
}

type NodeTypes = {
  [K in keyof NodePropMap]: FunctionComponent<NodePropMap[K]>;
};

export function isNodeType(key: string): key is keyof NodeTypes {
  return key in nodeTypes;
}

export const nodeTypes: NodeTypes = {
  'node--page': NodePage,
  'node--puck_page': NodePuckPage,
};
