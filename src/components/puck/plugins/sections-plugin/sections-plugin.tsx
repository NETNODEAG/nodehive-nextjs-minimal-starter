'use client';

import { Config, Drawer, Plugin } from '@puckeditor/core';
import { PanelsTopLeftIcon } from 'lucide-react';

import { SectionsPanel } from './sections-panel';

type CreateSectionsPluginOptions = {
  config: Config;
};

export function createSectionsPlugin({
  config,
}: CreateSectionsPluginOptions): Plugin {
  return {
    name: 'sections',
    label: 'Sections',
    icon: <PanelsTopLeftIcon className="size-6" />,
    render: () => <SectionsPanel config={config} />,
  };
}
