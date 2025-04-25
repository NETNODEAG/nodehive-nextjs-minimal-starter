import NodeWrapper from '@/nodehive/components/visual-editor/node/node-wrapper';
import { DrupalNode } from '@/nodehive/types';

import { isNodeType, nodeTypes } from './nodes';

interface NodeProps {
  node: DrupalNode;
}

export default function Node({ node }: NodeProps) {
  const nodeType = node?.type;

  if (isNodeType(nodeType)) {
    const NodeInstance = nodeTypes[nodeType];

    return (
      <NodeWrapper entity={node as DrupalNode}>
        <NodeInstance node={node as DrupalNode} />
      </NodeWrapper>
    );
  }

  return null;
}
