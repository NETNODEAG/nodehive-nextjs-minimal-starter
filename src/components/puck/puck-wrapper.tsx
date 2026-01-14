'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Config } from '@puckeditor/core';
import { motion } from 'framer-motion';
import { SquareDashedMousePointerIcon } from 'lucide-react';

import { DrupalNode } from '@/types/nodehive';
import { cn } from '@/lib/utils';
import PuckRender from '@/components/puck/puck-render';
import Button from '@/components/ui/atoms/button/button';

const LazyPuckEditor = dynamic(
  () => import('@/components/puck/editor/puck-editor'),
  {
    ssr: false,
  }
);

type PuckWrapperProps = {
  node: DrupalNode;
  fieldName: string;
  config: Config;
  isLoggedIn: boolean;
};

export default function PuckWrapper({
  node,
  fieldName,
  config,
  isLoggedIn,
}: PuckWrapperProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const puckDataParams = searchParams.get('puckeditor');
  const nodeData = node;
  const puckField = nodeData[fieldName];
  const puckData = JSON.parse(puckField) || {};
  const [isEditMode, setIsEditMode] = useState(puckDataParams === fieldName);

  const closePuckEditor = async () => {
    setIsEditMode(false);
    if (searchParams.has('puckeditor')) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('puckeditor');
      router.replace(`${pathName}?${newSearchParams.toString()}`, {
        scroll: true,
      });
    }
    router.refresh();
  };

  const openPuckEditor = () => {
    setIsEditMode(true);
  };

  if (!isLoggedIn) {
    return <PuckRender data={puckData} config={config} />;
  }

  return (
    <div
      style={
        {
          '--puck-font-family': 'var(--font-sans)',
        } as React.CSSProperties
      }
    >
      {!isEditMode && (
        <div
          className={cn(
            'hover:outline-primary relative -outline-offset-1 hover:outline-1 hover:outline-dashed',
            {
              'min-h-14': !puckData?.content || puckData?.content?.length === 0,
            }
          )}
        >
          <div className="sticky top-(--header-height) right-0 z-50 h-0 cursor-pointer">
            <div className="absolute top-2 right-2">
              <Button onClick={openPuckEditor} className="flex gap-2">
                <SquareDashedMousePointerIcon className="size-5 text-white" />
                Edit
              </Button>
            </div>
          </div>
          <PuckRender data={puckData} config={config} />
        </div>
      )}
      <motion.div
        className="fixed inset-0 z-50 border border-t border-b border-gray-300 bg-white"
        initial={{ y: '100%' }}
        animate={{ y: isEditMode ? 0 : '100%' }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        {isEditMode && (
          <LazyPuckEditor
            key={`puck-editor-${fieldName}`}
            fieldName={fieldName}
            node={node}
            data={puckData}
            config={config}
            closePuckEditor={closePuckEditor}
          />
        )}
      </motion.div>
    </div>
  );
}
