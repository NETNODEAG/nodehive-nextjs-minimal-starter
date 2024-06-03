export default function NodeWrapper({ entity, children }) {
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
      {children}
    </div>
  );
}
