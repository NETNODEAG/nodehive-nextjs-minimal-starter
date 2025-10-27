'use client';

import { useEffect, useState } from 'react';
import { Button, createUsePuck } from '@measured/puck';
import {
  Loader2Icon,
  PanelLeftIcon,
  PanelRightIcon,
  RedoIcon,
  UndoIcon,
  XIcon,
} from 'lucide-react';
import { ImperativePanelHandle } from 'react-resizable-panels';

import { cn } from '@/lib/utils';

const usePuck = createUsePuck();

type PuckHeaderProps = {
  onSave: (data: any) => void;
  onClose?: () => void;
  isSaving?: boolean;
  leftPanelRef: React.RefObject<ImperativePanelHandle | null>;
  rightPanelRef: React.RefObject<ImperativePanelHandle | null>;
};

export default function PuckHeader({
  onSave,
  onClose,
  leftPanelRef,
  rightPanelRef,
  isSaving,
}: PuckHeaderProps) {
  const selectedItem = usePuck((s) => s.selectedItem);
  const appState = usePuck((s) => s.appState);
  const history = usePuck((s) => s.history);
  const dispatch = usePuck((s) => s.dispatch);
  const previewMode = appState?.ui?.previewMode;

  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);

  useEffect(() => {
    if (
      selectedItem &&
      rightPanelRef?.current &&
      rightPanelRef.current.isCollapsed()
    ) {
      rightPanelRef.current.expand();
      setIsRightPanelCollapsed(false);
    }
  }, [selectedItem, rightPanelRef]);

  useEffect(() => {
    if (leftPanelRef?.current) {
      setIsLeftPanelCollapsed(leftPanelRef.current.isCollapsed());
    }
    if (rightPanelRef?.current) {
      setIsRightPanelCollapsed(rightPanelRef.current.isCollapsed());
    }
  }, [leftPanelRef, rightPanelRef]);

  const togglePreviewMode = () => {
    dispatch({
      type: 'setUi',
      ui: {
        previewMode: previewMode === 'edit' ? 'interactive' : 'edit',
      },
    });
  };

  const toggleLeftPanel = () => {
    if (leftPanelRef?.current) {
      const willCollapse = !leftPanelRef.current.isCollapsed();
      willCollapse
        ? leftPanelRef.current.collapse()
        : leftPanelRef.current.expand();
      setIsLeftPanelCollapsed(willCollapse);
    }
  };

  const toggleRightPanel = () => {
    if (rightPanelRef?.current) {
      const willCollapse = !rightPanelRef.current.isCollapsed();
      willCollapse
        ? rightPanelRef.current.collapse()
        : rightPanelRef.current.expand();
      setIsRightPanelCollapsed(willCollapse);
    }
  };

  return (
    <div className="mx-auto flex w-full justify-between gap-4 border-b border-gray-300 px-4 py-2">
      <div className="flex gap-2">
        <button
          className={cn('cursor-pointer', {
            'opacity-50': !history.hasPast,
          })}
          onClick={() => history.back()}
          disabled={!history.hasPast}
          title="Undo"
        >
          <UndoIcon />
        </button>
        <button
          className={cn('cursor-pointer', {
            'opacity-50': !history.hasFuture,
          })}
          onClick={() => history.forward()}
          disabled={!history.hasFuture}
          title="Redo"
        >
          <RedoIcon />
        </button>
        <button
          onClick={toggleLeftPanel}
          className={cn('cursor-pointer', {
            'opacity-50': isLeftPanelCollapsed,
          })}
          title={
            isLeftPanelCollapsed
              ? 'Show components panel'
              : 'Hide components panel'
          }
        >
          <PanelLeftIcon />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggleRightPanel}
          className={cn('cursor-pointer', {
            'opacity-50': isRightPanelCollapsed,
          })}
          title={
            isRightPanelCollapsed ? 'Show fields panel' : 'Hide fields panel'
          }
        >
          <PanelRightIcon />
        </button>
        <Button variant="secondary" onClick={togglePreviewMode}>
          Switch to {previewMode === 'edit' ? 'interactive' : 'edit'}
        </Button>
        <Button
          onClick={() => {
            onSave(appState.data);
          }}
        >
          {isSaving ? (
            <Loader2Icon className="ml-2 size-5 animate-spin" />
          ) : (
            'Save'
          )}
        </Button>
        <button onClick={onClose} className="cursor-pointer" title="Close">
          <XIcon />
        </button>
      </div>
    </div>
  );
}
