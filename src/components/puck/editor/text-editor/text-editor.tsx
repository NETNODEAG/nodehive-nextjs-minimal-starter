'use client';

import dynamic from 'next/dynamic';
import { FieldLabel } from '@puckeditor/core';
import { TextIcon } from 'lucide-react';

// Disable server-side rendering for the CKEditor component
const CKEditorWrapper = dynamic(() => import('./ck-editor-wrapper'), {
  ssr: false,
});

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  showEnlargeButton?: boolean;
  label: string;
  editorType?: 'default' | 'title';
}

export default function TextEditor({
  value,
  onChange,
  label,
  editorType = 'default',
}: TextEditorProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <FieldLabel
          icon={<TextIcon className="size-4" />}
          label={label}
        ></FieldLabel>
      </div>
      <CKEditorWrapper
        value={value}
        onChange={onChange}
        editorType={editorType}
      />
    </>
  );
}
