'use client';

import { Config, Plugin } from '@puckeditor/core';
import { LayoutTemplateIcon } from 'lucide-react';

import { TemplatesPanel } from './templates-panel';

type CreateTemplatesPluginOptions = {
  config: Config;
};

export function createTemplatesPlugin({
  config,
}: CreateTemplatesPluginOptions): Plugin {
  return {
    name: 'templates',
    label: 'Templates',
    icon: <LayoutTemplateIcon className="size-6" />,
    render: () => <TemplatesPanel config={config} />,
  };
}
