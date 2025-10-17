'use client';

import dynamic from 'next/dynamic';
import { X } from 'lucide-react';
import { Rnd } from 'react-rnd';

import styles from './ck-editor.module.css';

// Disable server-side rendering for the CKEditor component
const CKEditorWrapper = dynamic(() => import('./ck-editor-wrapper'), {
  ssr: false,
});

interface FloatingTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
}

export default function FloatingTextEditor({
  value,
  onChange,
  onClose,
}: FloatingTextEditorProps) {
  return (
    <div className="fixed inset-0 top-0 left-0 z-50 bg-black/10">
      <Rnd
        default={{
          x: window.innerWidth / 2 - 400,
          y: window.innerHeight / 2 - 200,
          width: 800,
          height: 400,
        }}
        bounds="window"
        dragHandleClassName="drag-handle"
        className="rounded-lg bg-white px-3 pb-3 shadow-lg"
      >
        <div className="drag-handle -mx-3 flex cursor-move items-center justify-between rounded-t-lg border-b bg-gray-50 p-2">
          <h3 className="font-medium">Text Editor</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="rounded-full p-1 transition-colors hover:bg-gray-200"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex h-[calc(100%-48px)] overflow-y-auto p-4">
          <CKEditorWrapper
            className={`h-full w-full ${styles.editor}`}
            value={value}
            onChange={onChange}
            autoFocus={true}
          />
        </div>
      </Rnd>
    </div>
  );
}
