import { AuthWrapper, NotLoggedIn } from '@/components/nodehive/auth-wrapper';
import IframeWrapper from '@/components/nodehive/visual-editor/iframe-wrapper';
import ParagraphEditButton from '@/components/nodehive/visual-editor/paragraph/paragraph-edit-button';

type ParagraphWrapperProps = {
  entity: any;
  enable?: boolean;
  editmode?: 'edit-form' | 'sidebar' | 'modal' | 'inline';
  children: React.ReactNode;
};

export default function ParagraphWrapper({
  entity,
  enable = true,
  editmode = 'sidebar',
  children,
}: ParagraphWrapperProps) {
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
        <IframeWrapper>
          <ParagraphEditButton
            label="Edit Paragraph"
            type="paragraph"
            uuid={id}
            id={drupal_internal__target_id}
            parentId={parent_id}
            langcode={entity.langcode}
          />

          {children}
        </IframeWrapper>
      </AuthWrapper>

      <NotLoggedIn>{children}</NotLoggedIn>
    </div>
  );
}
