'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FieldLabel } from '@measured/puck';
import { Maximize2, TextIcon } from 'lucide-react';

import FloatingTextEditor from './floating-text-editor';

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
  showEnlargeButton = false,
  label,
  editorType = 'default',
}: TextEditorProps) {
  const [isFloatingEditorOpen, setIsFloatingEditorOpen] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <FieldLabel
          icon={<TextIcon className="size-4" />}
          label={label}
        ></FieldLabel>
        {showEnlargeButton && (
          <button
            type="button"
            onClick={() => setIsFloatingEditorOpen(true)}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            title="Open in window"
            aria-label="Open in window"
          >
            <Maximize2 className="size-4" />
          </button>
        )}
      </div>
      <CKEditorWrapper
        value={value}
        onChange={onChange}
        editorType={editorType}
      />

      {isFloatingEditorOpen && (
        <FloatingTextEditor
          value={value}
          onChange={onChange}
          onClose={() => setIsFloatingEditorOpen(false)}
        />
      )}
    </>
  );
}
