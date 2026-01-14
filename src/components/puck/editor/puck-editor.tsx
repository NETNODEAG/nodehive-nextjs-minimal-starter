'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ActionBar,
  Button,
  ComponentData,
  Config,
  Content,
  createUsePuck,
  Data,
  Puck,
  PuckAction,
} from '@puckeditor/core';
import {
  ArrowLeftRightIcon,
  LayoutTemplateIcon,
  Loader2Icon,
  SaveIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { DrupalNode } from '@/types/nodehive';
import ComponentItem from '@/components/puck/editor/component-item';
import ComponentTemplateModal from '@/components/puck/editor/template-selector/component-template-modal';
import { TemplateSelectorModal } from '@/components/puck/editor/template-selector/template-selector-modal';

import '@puckeditor/core/no-external.css';

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
  const [isTemplateSelectorModalOpen, setIsTemplateSelectorModalOpen] =
    useState(false);
  const [isContentTemplateModalOpen, setIsContentTemplateModalOpen] =
    useState(false);
  const [templateContent, setTemplateContent] = useState<Content | null>(null);

  const onSave = async (data: Partial<Data>) => {
    setIsSaving(true);

    try {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to publish Puck data: ${errorData.message}`);
      }

      toast.success('Successfully saved page');
    } catch (error) {
      console.error('Failed to publish Puck data:', error);
      toast.error('Failed to save page');
    }

    setIsSaving(false);
  };

  const togglePreviewMode = ({
    isPreviewMode,
    dispatch,
  }: {
    isPreviewMode: boolean;
    dispatch: (action: PuckAction) => void;
  }) => {
    dispatch({
      type: 'setUi',
      ui: {
        previewMode: isPreviewMode ? 'edit' : 'interactive',
      },
    });
  };

  const handleComponentTemplateSaveAction = (
    selectedItem: ComponentData | null
  ) => {
    setTemplateContent(selectedItem ? [selectedItem] : null);
    setIsContentTemplateModalOpen(true);
  };

  return (
    <>
      <Puck
        config={config}
        data={data}
        headerTitle={nodeData.title || 'Page'}
        overrides={{
          drawerItem: ({ name }) => <ComponentItem name={name} />,
          actionBar: ({ children, label }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const selectedItem = usePuck((s) => s.selectedItem);
            return (
              <>
                <ActionBar label={label}>
                  <ActionBar.Group>
                    <ActionBar.Action
                      label="Save as template"
                      onClick={() =>
                        handleComponentTemplateSaveAction(selectedItem)
                      }
                    >
                      <SaveIcon className="size-[16px]" />
                    </ActionBar.Action>
                    {children}
                  </ActionBar.Group>
                </ActionBar>
              </>
            );
          },
          headerActions: () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const appState = usePuck((s) => s.appState);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const dispatch = usePuck((s) => s.dispatch);
            const mode = appState?.ui?.previewMode;
            const isPreviewMode = mode === 'interactive';
            return (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsTemplateSelectorModalOpen(true);
                  }}
                >
                  <LayoutTemplateIcon className="size-3" />
                  Templates
                </Button>
                <TemplateSelectorModal
                  isOpen={isTemplateSelectorModalOpen}
                  onClose={() => setIsTemplateSelectorModalOpen(false)}
                  fragmentType="puck_template"
                  dataField="field_puck_template_data"
                  iconField="field_media"
                  appState={appState}
                  dispatch={dispatch}
                  config={config}
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    togglePreviewMode({ isPreviewMode, dispatch });
                  }}
                >
                  <ArrowLeftRightIcon className="size-3" />{' '}
                  {isPreviewMode ? 'Edit' : 'Interactive'} mode
                </Button>
                <Button
                  onClick={() => {
                    onSave(appState.data);
                  }}
                >
                  {isSaving && <Loader2Icon className="size-3 animate-spin" />}
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
      <ComponentTemplateModal
        content={templateContent}
        isOpen={isContentTemplateModalOpen}
        setIsOpen={setIsContentTemplateModalOpen}
        fragmentType="puck_template"
        dataField="field_puck_template_data"
      />
    </>
  );
}
