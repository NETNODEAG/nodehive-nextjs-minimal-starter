'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { DrupalNode } from '@/nodehive/types';
import { Button } from '@measured/puck';
import { AnimatePresence } from 'framer-motion';
import { SquareDashedMousePointerIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import PuckEditor from '@/components/puck/editor/puck-editor';
import PuckRender from '@/components/puck/puck-render';

type PuckWrapperProps = {
  node: DrupalNode;
  fieldName: string;
  config: any;
};

export default function PuckWrapper({
  node,
  fieldName,
  config,
}: PuckWrapperProps) {
  const { isLoggedIn, user } = useAuth();
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

  // Check if user is logged in and has nodehive role
  const canEdit = isLoggedIn;

  if (!canEdit) {
    return <PuckRender data={puckData} config={config} />;
  }

  return (
    <AnimatePresence>
      {isEditMode ? (
        <PuckEditor
          key={`puck-editor-${fieldName}`}
          fieldName={fieldName}
          node={node}
          data={puckData}
          config={config}
          closePuckEditor={closePuckEditor}
        />
      ) : (
        <div
          className={cn(
            'hover:border-primary relative border-2 border-transparent hover:border-dashed',
            {
              'min-h-[56px]':
                !puckData?.content || puckData?.content?.length === 0,
            }
          )}
        >
          <div className="sticky top-[var(--header-height)] right-0 z-50 h-0 cursor-pointer">
            <div className="absolute top-2 right-2">
              <Button onClick={openPuckEditor}>
                <SquareDashedMousePointerIcon className="size-5 text-white" />
                Edit
              </Button>
            </div>
          </div>
          <PuckRender data={puckData} config={config} />
        </div>
      )}
    </AnimatePresence>
  );
}
