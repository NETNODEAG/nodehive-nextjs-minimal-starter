'use client';

import { Content } from '@measured/puck';

import { TemplateForm } from '@/components/puck/editor/template-selector/template-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/atoms/dialog/dialog';

type ContentTempalteModalProps = {
  content: Content | null;
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
  fragmentType: string;
  dataField: string;
};

export default function ComponentTemplateModal({
  content,
  isOpen,
  setIsOpen,
  fragmentType,
  dataField,
}: ContentTempalteModalProps) {
  if (!content) return null;
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
      <DialogContent className="max-h-dvh max-w-3xl overflow-y-auto xl:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create new component template</DialogTitle>
          <DialogDescription>
            Save this component as a new template
          </DialogDescription>
        </DialogHeader>
        <TemplateForm
          content={content}
          onCancel={() => setIsOpen(false)}
          onTemplateSaved={() => setIsOpen(false)}
          fragmentType={fragmentType}
          dataField={dataField}
        />
      </DialogContent>
    </Dialog>
  );
}
