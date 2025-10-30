'use client';

import React from 'react';
import Image from 'next/image';
import {
  ArrowUp10Icon,
  BarChart3Icon,
  BoxIcon,
  BoxSelectIcon,
  ColumnsIcon,
  DivideIcon,
  FileTextIcon,
  FilmIcon,
  GridIcon,
  GripVerticalIcon,
  HeadingIcon,
  ImageIcon,
  LayoutTemplateIcon,
  ListCollapseIcon,
  MenuIcon,
  MonitorIcon,
  MousePointerClickIcon,
  QuoteIcon,
  SpaceIcon,
  SparklesIcon,
  TextIcon,
  TimerIcon,
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
  AccordionSection: <ListCollapseIcon className="size-4" />,
  Banner: <ImageIcon className="size-4" />,
  Datawrapper: <BarChart3Icon className="size-4" />,
  LPHero: <MonitorIcon className="size-4" />,
  Media: <FilmIcon className="size-4" />,
  TextSection: <FileTextIcon className="size-4" />,
  Countdown: <TimerIcon className="size-4" />,
  Counter: <ArrowUp10Icon className="size-4" />,
  CTA: <MousePointerClickIcon className="size-4" />,
  Quote: <QuoteIcon className="size-4" />,
  // TwoColumnsLayout: <ColumnsIcon className="size-4" />,
  // ShareCard: <Share2Icon className="size-4" />,
  // PersonCard: <UserCircleIcon className="size-4" />,
  // CommentBox: <MessageSquareIcon className="size-4" />,
  // SidebarAccordion: <ListCollapseIcon className="size-4" />,
  // Persons: <UsersIcon className="size-4" />,
  Grid: <GridIcon className="size-4" />,
  Section: <BoxSelectIcon className="size-4" />,
  Space: <SpaceIcon className="size-4" />,
  Divider: <DivideIcon className="size-4" />,
  TwoColumns: <ColumnsIcon className="size-4" />,
  Heading: <HeadingIcon className="size-4" />,
  Text: <TextIcon className="size-4" />,
  Button: <MousePointerClickIcon className="size-4" />,
  Image: <ImageIcon className="size-4" />,
  HeadingTemplate: <LayoutTemplateIcon className="size-4" />,
  ImageTextTemplate: <LayoutTemplateIcon className="size-4" />,
  Animation: <SparklesIcon className="size-4" />,
  CountUp: <ArrowUp10Icon className="size-4" />,
  AsideMenu: <MenuIcon className="size-4" />,
};

// Component preview images
const COMPONENT_PREVIEWS: Record<string, string> = {
  AccordionSection: '/images/previews/accordion-section.png',
  Banner: '/images/previews/banner.png',
  Datawrapper: '/images/previews/datawrapper.png',
  LPHero: '/images/previews/lp-hero.png',
  Media: '/images/previews/media.png',
  TextSection: '/images/previews/text-section.png',
  TwoColumnsLayout: '/images/previews/two-columns.png',
  ShareCard: '/images/previews/share-card.png',
  PersonCard: '/images/previews/person-card.png',
  CommentBox: '/images/previews/comment-box.png',
  Countdown: '/images/previews/countdown.png',
  Counter: '/images/previews/counter.png',
  CTA: '/images/previews/cta.png',
  Quote: '/images/previews/quote.png',
  SidebarAccordion: '/images/previews/sidebar-accordion.png',
  Persons: '/images/previews/persons.png',
  Heading: '/images/previews/heading.png', // TODO: Add actual preview
  Text: '/images/previews/text.png', // TODO: Add actual preview
  Button: '/images/previews/button.png', // TODO: Add actual preview
  Image: '/images/previews/image.png', // TODO: Add actual preview
  Grid: '/images/previews/grid.png', // TODO: Add actual preview
  Section: '/images/previews/section.png', // TODO: Add actual preview
  Space: '/images/previews/space.png', // TODO: Add actual preview
  Divider: '/images/previews/divider.png', // TODO: Add actual preview
  TwoColumns: '/images/previews/two-columns.png', // TODO: Add actual preview
  AsideMenu: '/images/previews/aside-menu.png', // TODO: Add actual preview
  HeadingTemplate: '/images/previews/heading-template.png', // TODO: Add actual preview
  ImageTextTemplate: '/images/previews/image-text-template.png', // TODO: Add actual preview
};

const COMPONENT_LABELS: Record<string, string> = {
  AccordionSection: 'Akkordeon',
  Banner: 'Banner',
  Datawrapper: 'Datawrapper',
  LPHero: 'Hero',
  Media: 'Media',
  TextSection: 'Text',
  Quote: 'Zitat',
  Countdown: 'Countdown',
  Counter: 'Counter',
  CTA: 'Call to Action',
  Heading: 'Heading',
  Text: 'Text',
  Button: 'Button',
  Section: 'Abschnitt',
  Space: 'Abstand',
  Divider: 'Trenner',
  Grid: 'Grid',
  Image: 'Bild',
  TwoColumns: 'Zwei Spalten',
  HeadingTemplate: 'Heading Template',
  ImageTextTemplate: 'Image-Text Template',
  Animation: 'Animation',
  CountUp: 'Count Up',
  AsideMenu: 'Inhaltsverzeichnis',
};

export default function ComponentItem({ name }: ComponentItemProps) {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex cursor-grab items-center justify-between gap-2 rounded-md bg-white px-3 py-2.5 shadow-sm transition-all duration-150 hover:shadow-md'
            )}
          >
            <div className="flex w-full items-center gap-2">
              <div className="flex-shrink-0">
                {COMPONENT_ICONS[name] || <BoxIcon className="size-4" />}
              </div>
              <span className="truncate text-sm">
                {COMPONENT_LABELS[name] || name}
              </span>
            </div>
            <GripVerticalIcon className="size-3 flex-shrink-0" />
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
