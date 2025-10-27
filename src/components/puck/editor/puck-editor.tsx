'use client';

import { Config, Puck } from '@measured/puck';
import { motion } from 'framer-motion';

import '@measured/puck/puck.css';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import useWindowSize from '@/hooks/use-window-size';
import { DrupalNode } from '@/nodehive/types';
import { ImperativePanelHandle } from 'react-resizable-panels';

import ComponentItem from '@/components/puck/editor/component-item';
import PuckHeader from '@/components/puck/editor/puck-header';
import { H3 } from '@/components/theme/atoms-content/heading/heading';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/atoms/resizable/resizable';

type PuckEditorProps = {
  node: DrupalNode;
  fieldName: string;
  data: any;
  config: Config;
  closePuckEditor: () => void;
};

export default function PuckEditor({
  node,
  fieldName,
  data,
  config,
  closePuckEditor,
}: PuckEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const windowSize = useWindowSize();
  const width = windowSize.width || 1440;
  const previewDefaultSize = (896 / width) * 100;
  const leftSidebarCollapsedSize = (80 / width) * 100;
  const rightSidebarMinSize = (300 / width) * 100;
  const sidebarMaxSize = (320 / width) * 100;
  const nodeData = node;
  const lang = nodeData?.langcode;
  const pathName = usePathname();
  const leftPanelRef = useRef<ImperativePanelHandle | null>(null);
  const rightPanelRef = useRef<ImperativePanelHandle | null>(null);

  // prevent scrolling when editor is open
  useEffect(() => {
    const scrollContainer = document.querySelector('#scroll-container');
    if (!scrollContainer) return;
    scrollContainer.classList.add('!overflow-hidden');

    return () => {
      scrollContainer.classList.remove('!overflow-hidden');
    };
  }, []);

  const onSave = async (data: any) => {
    setIsSaving(true);
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
      console.error('Failed to publish Puck data:', errorData);
      return;
    }

    setIsSaving(false);
    closePuckEditor();
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
        overrides={{
          componentItem: ({ name }) => <ComponentItem name={name} />,
        }}
      >
        <PuckHeader
          onSave={onSave}
          isSaving={isSaving}
          onClose={closePuckEditor}
          leftPanelRef={leftPanelRef}
          rightPanelRef={rightPanelRef}
        />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            minSize={10}
            maxSize={sidebarMaxSize}
            collapsible
            collapsedSize={leftSidebarCollapsedSize}
            ref={leftPanelRef}
            className="h-[calc(100dvh-var(--puck-header-height))]"
          >
            <div className="@container h-full space-y-12 overflow-auto p-4">
              <div>
                <H3 className="mb-4 hidden @min-[180px]:block">Komponenten</H3>
                <Puck.Components />
              </div>
              <div>
                <H3 className="mb-4 hidden @min-[180px]:block">Outline</H3>
                <Puck.Outline />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={previewDefaultSize}
            className="h-[calc(100dvh-var(--puck-header-height))]"
          >
            <div className="h-full">
              <Puck.Preview id="puck-iframe" />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            collapsible
            minSize={rightSidebarMinSize}
            maxSize={sidebarMaxSize}
            ref={rightPanelRef}
            className="relative h-[calc(100dvh-var(--puck-header-height))]"
          >
            <div className="h-full overflow-auto p-4">
              <H3 className="mb-4">Felder</H3>
              <Puck.Fields />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Puck>
    </motion.div>
  );
}
