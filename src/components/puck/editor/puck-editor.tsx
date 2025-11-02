'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button, Config, createUsePuck, Data, Puck } from '@measured/puck';
import { motion } from 'framer-motion';
import { Loader2Icon, XIcon } from 'lucide-react';

import { DrupalNode } from '@/types/nodehive';
import ComponentItem from '@/components/puck/editor/component-item';

import '@measured/puck/puck.css';

type PuckEditorProps = {
  node: DrupalNode;
  fieldName: string;
  data: Partial<Data>;
  config: Config;
  closePuckEditor: () => void;
};

const usePuck = createUsePuck();

export default function PuckEditor({
  node,
  fieldName,
  data,
  config,
  closePuckEditor,
}: PuckEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const nodeData = node;
  const lang = nodeData?.langcode;
  const pathName = usePathname();

  const onSave = async (data: Partial<Data>) => {
    setIsSaving(true);

    console.log('Attempting to save Puck data...', {
      lang,
      fieldName,
      nodeId: nodeData.id,
      type: nodeData?.type,
    });

    const response = await fetch(`/${lang}/api/puck/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: data,
        fieldName: fieldName,
        nodeId: nodeData.id,
        path: pathName,
        type: nodeData?.type,
        lang: lang,
      }),
    });

    console.log('Publish response:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to publish Puck data:', errorData);
      setIsSaving(false);
      return;
    }

    const result = await response.json();
    console.log('Successfully published:', result);
    setIsSaving(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 border border-t border-b border-gray-300 bg-white"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      <Puck
        config={config}
        data={data}
        headerTitle={nodeData.title || 'Page'}
        overrides={{
          componentItem: ({ name }) => <ComponentItem name={name} />,
          headerActions: () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const appState = usePuck((s) => s.appState);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const dispatch = usePuck((s) => s.dispatch);
            const previewMode = appState?.ui?.previewMode;
            const togglePreviewMode = () => {
              dispatch({
                type: 'setUi',
                ui: {
                  previewMode: previewMode === 'edit' ? 'interactive' : 'edit',
                },
              });
            };
            return (
              <>
                <Button variant="secondary" onClick={togglePreviewMode}>
                  Switch to {previewMode === 'edit' ? 'interactive' : 'edit'}
                </Button>
                <Button
                  onClick={() => {
                    onSave(appState.data);
                  }}
                >
                  {isSaving && <Loader2Icon className="size-5 animate-spin" />}
                  Save
                </Button>
                <button
                  onClick={closePuckEditor}
                  className="cursor-pointer"
                  title="Close"
                >
                  <XIcon />
                </button>
              </>
            );
          },
        }}
      ></Puck>
    </motion.div>
  );
}
