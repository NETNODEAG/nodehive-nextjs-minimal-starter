'use client';

import { useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Alignment,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  SourceEditing,
  Underline,
} from 'ckeditor5';

import { cn } from '@/lib/utils';

import 'ckeditor5/ckeditor5.css';

type CKEditorWrapperProps = {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  editorType?: 'default' | 'title';
};

export default function CKEditorWrapper({
  value,
  onChange,
  className,
  autoFocus = false,
  editorType = 'default',
}: CKEditorWrapperProps) {
  const editorRef = useRef<any>(null);

  // Configure editor based on type
  const getEditorConfig = () => {
    if (editorType === 'title') {
      return {
        licenseKey: 'GPL',
        plugins: [Essentials, Paragraph, Bold, Italic],
        toolbar: ['bold', 'italic'],
        initialData: value,
      };
    }

    // Default configuration with full features
    return {
      licenseKey: 'GPL',
      plugins: [
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Underline,
        Heading,
        Link,
        List,
        SourceEditing,
        Alignment,
      ],
      toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'alignment',
        'link',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'undo',
        'redo',
        '|',
        'sourceEditing',
      ],
      initialData: value,
      heading: {
        options: [
          {
            model: 'paragraph' as const,
            title: 'Paragraph',
            class: 'ck-heading_paragraph',
          },
          {
            model: 'heading2' as const,
            view: 'h2' as const,
            title: 'Heading 2',
            class: 'ck-heading_heading2',
          },
          {
            model: 'heading3' as const,
            view: 'h3' as const,
            title: 'Heading 3',
            class: 'ck-heading_heading3',
          },
          {
            model: 'heading4' as const,
            view: 'h4' as const,
            title: 'Heading 4',
            class: 'ck-heading_heading4',
          },
        ],
      },
    };
  };

  return (
    <div className={cn('prose prose-slate max-w-none', className)}>
      <CKEditor
        editor={ClassicEditor}
        config={getEditorConfig()}
        onReady={(editor) => {
          // Store the editor instance in the ref
          editorRef.current = editor;

          if (autoFocus) {
            // Focus the editor after it's initialized
            editor.focus();
          }
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange && onChange(data);
        }}
      />
    </div>
  );
}
