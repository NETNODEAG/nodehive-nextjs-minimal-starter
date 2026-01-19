'use client';

import { Content } from '@puckeditor/core';

import { TemplateForm } from '@/components/puck/editor/template-selector/template-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/atoms/dialog/dialog';

type ContentTemplateModalProps = {
  content: Content | null;
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
  fragmentType: string;
  dataField: string;
  onTemplateSaved?: () => void;
};

export default function ComponentTemplateModal({
  content,
  isOpen,
  setIsOpen,
  fragmentType,
  dataField,
  onTemplateSaved,
}: ContentTemplateModalProps) {
  if (!content) return null;

  const handleTemplateSaved = () => {
    setIsOpen(false);
    onTemplateSaved?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
      <DialogContent className="max-h-dvh max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new component template</DialogTitle>
          <DialogDescription>
            Save this component as a new template
          </DialogDescription>
        </DialogHeader>
        <TemplateForm
          content={content}
          onCancel={() => setIsOpen(false)}
          onTemplateSaved={handleTemplateSaved}
          fragmentType={fragmentType}
          dataField={dataField}
        />
      </DialogContent>
    </Dialog>
  );
}
