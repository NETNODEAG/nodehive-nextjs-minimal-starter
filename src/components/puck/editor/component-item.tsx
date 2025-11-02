'use client';

import React from 'react';
import Image from 'next/image';
import {
  BoxIcon,
  BoxSelectIcon,
  Columns2Icon,
  GridIcon,
  GripVerticalIcon,
  HeadingIcon,
  IdCardIcon,
  ImageIcon,
  ListOrdered,
  MousePointerClickIcon,
  PlaySquareIcon,
  SpaceIcon,
  TextIcon,
  WallpaperIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/atoms/tooltip/tooltip-editor';

type ComponentItemProps = {
  name: string;
};

// Component icon mapping
const COMPONENT_ICONS: Record<string, React.ReactNode> = {
  // Layout
  Container: <BoxSelectIcon className="size-4" />,
  Grid: <GridIcon className="size-4" />,
  TwoColumns: <Columns2Icon className="size-4" />,
  Space: <SpaceIcon className="size-4" />,
  // Content
  Heading: <HeadingIcon className="size-4" />,
  BodyCopy: <TextIcon className="size-4" />,
  CallToAction: <MousePointerClickIcon className="size-4" />,
  Image: <ImageIcon className="size-4" />,
  Video: <PlaySquareIcon className="size-4" />,
  // Organisms
  Card: <IdCardIcon className="size-4" />,
  Statistics: <ListOrdered className="size-4" />,
  // Sections
  Hero: <WallpaperIcon className="size-4" />,
  TwoColumnContent: <Columns2Icon className="size-4" />,
};

// TODO add preview
const COMPONENT_PREVIEWS: Record<string, string> = {};

const COMPONENT_LABELS: Record<string, string> = {
  // Layout
  Container: 'Container',
  Grid: 'Grid',
  TwoColumns: 'Two Columns',
  Space: 'Space',
  // Content
  Heading: 'Heading',
  BodyCopy: 'Text',
  CallToAction: 'Call to Action',
  Image: 'Image',
  Video: 'Video',
  // Organisms
  Card: 'Card',
  Statistics: 'Statistics',
  // Sections
  Hero: 'Hero',
  TwoColumnContent: 'Two Columns Content',
};

export default function ComponentItem({ name }: ComponentItemProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex cursor-grab items-center justify-between gap-2 rounded-md bg-white px-3 py-2.5 shadow-sm transition-all duration-150 hover:shadow-md'
            )}
          >
            <div className="flex w-full items-center gap-2">
              <div className="shrink-0">
                {COMPONENT_ICONS[name] || <BoxIcon className="size-4" />}
              </div>
              <span className="truncate text-sm">
                {COMPONENT_LABELS[name] || name}
              </span>
            </div>
            <GripVerticalIcon className="size-3 shrink-0" />
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            side="right"
            align="start"
            className="border border-gray-300 bg-transparent p-0 shadow-none"
          >
            {COMPONENT_PREVIEWS[name] && (
              <div className="rounded-md bg-white p-1 shadow-lg">
                <div className="flex aspect-video h-auto w-56 items-center overflow-hidden rounded">
                  <Image
                    src={COMPONENT_PREVIEWS[name]}
                    alt={`${name} preview`}
                    width={224}
                    height={126}
                  />
                </div>
              </div>
            )}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}
