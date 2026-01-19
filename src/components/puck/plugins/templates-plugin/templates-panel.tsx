'use client';

import { useState } from 'react';
import { Config, createUsePuck } from '@puckeditor/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  LayoutTemplateIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { getLocaleFromPathname } from '@/lib/utils';
import { TemplateForm } from '@/components/puck/editor/template-selector/template-form';
import { generateTemplateIds } from '@/components/puck/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/atoms/dialog/dialog';

const usePuck = createUsePuck();

type Template = {
  id: string;
  title: string;
  field_puck_template_data: string;
};

type TemplatesPanelProps = {
  config: Config;
};

const fetchTemplates = async () => {
  const language = getLocaleFromPathname(window.location.pathname);
  const response = await fetch(
    `/${language}/api/puck/fragment/puck_template?limit=100`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }

  return response.json();
};

export function TemplatesPanel({ config }: TemplatesPanelProps) {
  const appState = usePuck((s) => s.appState);
  const dispatch = usePuck((s) => s.dispatch);
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['templates-plugin'],
    queryFn: fetchTemplates,
  });

  const templates: Template[] = data?.data || [];

  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addTemplate = (template: Template) => {
    try {
      let templateData = JSON.parse(template.field_puck_template_data);

      if (!Array.isArray(templateData)) {
        templateData = [templateData];
      }

      const templateContent = generateTemplateIds(templateData, config);
      const newContent = [
        ...(appState?.data?.content || []),
        ...templateContent,
      ];

      dispatch({
        type: 'setData',
        data: {
          ...appState?.data,
          content: newContent,
        },
      });

      // Focus the first item of the added template
      if (templateContent.length > 0) {
        const firstItemIndex = newContent.length - templateContent.length;
        dispatch({
          type: 'setUi',
          ui: {
            itemSelector: {
              index: firstItemIndex,
              zone: undefined,
            },
          },
        });
      }

      toast.success(`Added "${template.title}" to page`);
    } catch (error) {
      console.error('Failed to add template:', error);
      toast.error('Failed to add template');
    }
  };

  const handleTemplateSaved = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['templates-plugin'] });
  };

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Save Current Page Button */}
        <div className="border-b border-gray-200 p-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <PlusIcon className="h-4 w-4" />
            Save page as template
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-gray-200 p-3">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-200 py-1.5 pr-8 pl-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2Icon className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-gray-500">
              No templates found
            </div>
          ) : (
            <div className="space-y-1.5 p-3">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => addTemplate(template)}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <LayoutTemplateIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate text-left">{template.title}</span>
                  <PlusIcon className="ml-auto h-4 w-4 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Template Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-dvh max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Save page as template</DialogTitle>
            <DialogDescription>
              Save the current page content as a reusable template
            </DialogDescription>
          </DialogHeader>
          <TemplateForm
            content={appState?.data?.content || []}
            onCancel={() => setIsModalOpen(false)}
            onTemplateSaved={handleTemplateSaved}
            fragmentType="puck_template"
            dataField="field_puck_template_data"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
