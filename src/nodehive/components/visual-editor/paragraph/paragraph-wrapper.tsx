import {
  AuthWrapper,
  NotLoggedIn,
} from '@/nodehive/components/auth/auth-wrapper';

import ParagraphEditButton from './paragraph-edit-button';

export default function ParagraphWrapper({
  entity,
  enable = true,
  editmode = 'sidebar',
  children,
}) {
  const { meta, type, parent_id, id } = entity;
  const { drupal_internal__target_id } = meta || {};

  if (!type) {
    return <div>no visual editor {children}</div>;
  }

  // Preparing dynamic ID
  const dynamicId = `node-${entity.meta.drupal_internal__target_id}`;

  return (
    <div
      id={dynamicId}
      paragraph-type={type}
      data-nodehive-enable={enable.toString()}
      data-nodehive-editmode={editmode} // edit-form, sidebar, modal, inline
      data-nodehive-type="paragraph"
      data-nodehive-parent_id={parent_id}
      data-nodehive-id={drupal_internal__target_id}
      data-nodehive-uuid={id}
      data-nodehive-langcode={entity.langcode}
      className="relative"
    >
      <AuthWrapper>
        <div className="rounded-lg outline-primary-700 hover:outline-dashed hover:outline-2 hover:-outline-offset-2">
          <ParagraphEditButton
            label="Edit Paragraph"
            type="paragraph"
            uuid={id}
            id={drupal_internal__target_id}
            parentId={parent_id}
            langcode={entity.langcode}
          />

          {children}
        </div>
      </AuthWrapper>

      <NotLoggedIn>{children}</NotLoggedIn>
    </div>
  );
}
