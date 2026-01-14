'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AppState, Button, Config, PuckAction } from '@puckeditor/core';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { cn, getLocaleFromPathname } from '@/lib/utils';
import { TemplateForm } from '@/components/puck/editor/template-selector/template-form';
import { generateTemplateIds } from '@/components/puck/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/atoms/dialog/dialog';

const PAGE_LIMIT = 10;

type TemplateSelectorModalProps = {
  appState: AppState;
  dispatch: (action: PuckAction) => void;
  fragmentType: string;
  dataField: string;
  iconField?: string;
  isOpen: boolean;
  onClose: () => void;
  config: Config;
};

const fetchFragments = async ({
  type,
  query,
  offset,
  limit,
}: {
  type: string;
  query: string;
  offset: number;
  limit: number;
}) => {
  const searchParams = new URLSearchParams();
  if (query) {
    searchParams.append('query', query);
  }
  searchParams.append('offset', offset.toString());
  searchParams.append('limit', limit.toString());
  // TODO: Improve the langauge loading
  const language = getLocaleFromPathname(window.location.pathname);
  const response = await fetch(
    `/${language}/api/puck/fragment/${type}?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch media items');
  }

  return response.json();
};

export function TemplateSelectorModal({
  appState,
  dispatch,
  fragmentType,
  dataField,
  iconField,
  isOpen,
  onClose,
  config,
}: TemplateSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const addTemplate = (
    appState: AppState,
    dispatch: (action: PuckAction) => void,
    templateString: string,
    config: Config
  ) => {
    try {
      let template = JSON.parse(templateString);

      if (!Array.isArray(template)) {
        template = [template];
      }

      const templateContent = generateTemplateIds(template, config);

      appState?.data?.content.push(...templateContent);

      dispatch({
        type: 'setData',
        data: appState?.data,
      });
      toast.success('Template added to page');
      onClose();
    } catch (error) {
      console.error('Failed to add template:', error);
      toast.error('Failed to add template');
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'fragments',
      fragmentType,
      appliedSearchQuery,
      currentOffset,
      PAGE_LIMIT,
    ],
    queryFn: () =>
      fetchFragments({
        type: fragmentType,
        query: appliedSearchQuery,
        offset: currentOffset,
        limit: PAGE_LIMIT,
      }),
    enabled: isOpen && !!fragmentType,
  });

  const templates =
    data?.data?.map((item: any) => ({
      ...item,
      thumbnailImage:
        iconField && item?.[iconField]?.thumbnail?.uri?.url
          ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${item?.[iconField]?.thumbnail?.uri?.url}`
          : '',
    })) || [];

  const hasNextPage = !!data?.links?.next;
  const hasPreviousPage = !!data?.links?.prev;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearchQuery(searchQuery);
    setCurrentOffset(0);
    refetch();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
    setCurrentOffset(0);
    refetch();
  };

  const handleTemplateSaved = () => {
    refetch();
    setShowTemplateForm(false);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentOffset((prev) => prev + PAGE_LIMIT);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentOffset((prev) => prev - PAGE_LIMIT);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-dvh max-w-3xl overflow-y-auto xl:max-w-5xl">
        {showTemplateForm && (
          <>
            <DialogHeader>
              <DialogTitle>Create new page template</DialogTitle>
              <DialogDescription>
                Save the current page content as a new template
              </DialogDescription>
            </DialogHeader>
            <TemplateForm
              content={appState?.data?.content}
              onCancel={() => setShowTemplateForm(false)}
              onTemplateSaved={handleTemplateSaved}
              fragmentType={fragmentType}
              dataField={dataField}
            />
          </>
        )}
        {!showTemplateForm && (
          <>
            <DialogHeader>
              <DialogTitle>Select Template</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search Template"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 py-1.5 pr-10 pl-8"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label="Clear search"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Search
                </Button>
              </form>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
                {isLoading ? (
                  Array.from({ length: PAGE_LIMIT }).map((_, index) => (
                    <div key={index} className="min-h-8" />
                  ))
                ) : templates.length > 0 ? (
                  templates.map((template: any) => (
                    <div
                      key={template.id}
                      className={cn(
                        'cursor-pointer rounded-lg border border-gray-200 p-2 transition-all hover:border-gray-300'
                      )}
                      onClick={() =>
                        addTemplate(
                          appState,
                          dispatch,
                          template?.[dataField],
                          config
                        )
                      }
                    >
                      {template.thumbnailImage && (
                        <Image
                          width={180}
                          height={180}
                          src={template.thumbnailImage}
                          alt={template.title}
                          className="mb-2"
                        />
                      )}
                      <div className="text-sm">{template.title}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center">
                    No Templates Found
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-3">
                <div className="col-start-2 flex items-center justify-center gap-2">
                  {hasPreviousPage ? (
                    <button
                      className="cursor-pointer"
                      onClick={handlePreviousPage}
                    >
                      <ChevronLeftIcon className="hover:text-primary size-5" />
                    </button>
                  ) : (
                    <div className="size-5"></div>
                  )}
                  <span>Page {Math.floor(currentOffset / PAGE_LIMIT) + 1}</span>
                  {hasNextPage ? (
                    <button onClick={handleNextPage} className="cursor-pointer">
                      <ChevronRightIcon className="hover:text-primary size-5" />
                    </button>
                  ) : (
                    <div className="size-5"></div>
                  )}
                </div>
              </div>
              <div className="col-start-3 flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowTemplateForm(true)}
                >
                  Create new page template
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
