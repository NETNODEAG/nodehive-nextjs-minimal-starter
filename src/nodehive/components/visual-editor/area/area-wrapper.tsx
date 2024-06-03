export default function AreaWrapper({
  entity,
  enable = true,
  editmode = 'sidebar',
  children,
}) {
  const { type, id, drupal_internal__fid, machine_name } = entity;

  return (
    <div
      id={id}
      area-type={type}
      data-nodehive-enable={enable.toString()}
      data-nodehive-editmode={editmode} // edit-form, sidebar, modal, inline
      data-nodehive-type="area"
      data-nodehive-id={drupal_internal__fid}
      data-nodehive-uuid={id}
      className="relative w-full overflow-hidden rounded-lg p-2 ring-2 ring-primary-600/10 md:p-6"
    >
      <div className="flex items-center justify-between">{children}</div>
    </div>
  );
}
