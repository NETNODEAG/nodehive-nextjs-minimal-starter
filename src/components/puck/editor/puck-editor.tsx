'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ActionBar,
  blocksPlugin,
  Button,
  ComponentData,
  Config,
  Content,
  createUsePuck,
  Data,
  outlinePlugin,
  Puck,
  PuckAction,
} from '@puckeditor/core';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeftRightIcon, Loader2Icon, SaveIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import { DrupalNode } from '@/types/nodehive';
import { absoluteUrl, isRelative } from '@/lib/utils';
import ComponentItem from '@/components/puck/editor/component-item';
import ComponentTemplateModal from '@/components/puck/editor/template-selector/component-template-modal';
import { createSectionsPlugin } from '@/components/puck/plugins/sections-plugin';
import { createTemplatesPlugin } from '@/components/puck/plugins/templates-plugin';

import '@puckeditor/core/no-external.css';

type PuckEditorProps = {
  node: DrupalNode;
  fieldName: string;
  data: Partial<Data>;
  config: Config;
  closePuckEditor: () => void;
};

const usePuck = createUsePuck();

type PuckPageSettings = {
  metadataTitle: string;
  metadataDescription: string;
  metadataImage: {
    id?: string;
    type?: string;
    name?: string;
    thumbnailImage?: string;
  } | null;
  publishedState: 'published' | 'unpublished';
  urlAlias: string;
};

type PuckRootProps = Record<string, unknown> & Partial<PuckPageSettings>;

function getDefaultPageSettings(node: DrupalNode): PuckPageSettings {
  const metadataImage = node?.field_metadata_image;
  const mediaImage = metadataImage?.field_media_image;
  const firstMediaImage = Array.isArray(mediaImage)
    ? mediaImage[0]
    : mediaImage;

  return {
    metadataTitle: node?.field_metadata_title || '',
    metadataDescription: node?.field_metadata_description || '',
    metadataImage: metadataImage?.id
      ? {
          id: metadataImage.id,
          type: metadataImage.type || 'media--image',
          name: metadataImage.name || '',
          thumbnailImage: firstMediaImage?.uri?.url
            ? isRelative(firstMediaImage.uri.url)
              ? absoluteUrl(firstMediaImage.uri.url)
              : firstMediaImage.uri.url
            : '',
        }
      : null,
    publishedState: node?.status ? 'published' : 'unpublished',
    urlAlias: node?.path?.alias || '',
  };
}

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
  const queryClient = useQueryClient();
  const [isContentTemplateModalOpen, setIsContentTemplateModalOpen] =
    useState(false);
  const [templateContent, setTemplateContent] = useState<Content | null>(null);

  const defaultPageSettings = getDefaultPageSettings(nodeData);
  const rootProps = (data?.root?.props || {}) as PuckRootProps;
  const editorData: Partial<Data> = {
    ...data,
    root: {
      ...(data?.root || {}),
      props: {
        ...defaultPageSettings,
        ...rootProps,
      } as unknown as Data['root']['props'],
    },
  };

  const plugins = [
    createSectionsPlugin({ config }),
    blocksPlugin(),
    outlinePlugin(),
    createTemplatesPlugin({ config }),
  ];

  const onSave = async (data: Partial<Data>) => {
    setIsSaving(true);
    const rootProps = (data?.root?.props || {}) as PuckRootProps;
    const {
      metadataTitle = '',
      metadataDescription = '',
      metadataImage = null,
      publishedState = 'unpublished',
      urlAlias = '',
      ...contentRootProps
    } = rootProps;

    const puckData: Partial<Data> = {
      ...data,
      root: {
        ...(data?.root || {}),
        props: contentRootProps as Data['root']['props'],
      },
    };

    try {
      const response = await fetch(`/${lang}/api/puck/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: puckData,
          pageSettings: {
            metadataTitle,
            metadataDescription,
            metadataImage,
            published: publishedState === 'published',
            urlAlias,
          },
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
        data={editorData}
        headerTitle={nodeData.title || 'Page'}
        plugins={plugins}
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
        onTemplateSaved={() =>
          queryClient.invalidateQueries({ queryKey: ['templates-plugin'] })
        }
      />
    </>
  );
}
