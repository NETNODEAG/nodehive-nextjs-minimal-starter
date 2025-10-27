import NodeMetadata from '@/components/nodehive/visual-editor/node/node-metadata';

type NodeWrapperProps = {
  entity: any;
  children: React.ReactNode;
};

export default function NodeWrapper({ entity, children }: NodeWrapperProps) {
  const { id, drupal_internal__nid, type } = entity;

  const dynamicId = `node-${drupal_internal__nid}`;

  return (
    <div
      id={dynamicId}
      node-type={type}
      data-nodehive-type="node"
      data-nodehive-id={drupal_internal__nid}
      data-nodehive-uuid={id}
      className="relative"
    >
      <NodeMetadata entity={entity} />

      {children}
    </div>
  );
}
