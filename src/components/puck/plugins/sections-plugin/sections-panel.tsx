'use client';

import { Config, Drawer } from '@puckeditor/core';

import ComponentItem from '@/components/puck/editor/component-item';

type SectionsPanelProps = {
  config: Config;
};

const SECTION_COMPONENTS = ['Hero', 'ContentSection'];

export function SectionsPanel({ config }: SectionsPanelProps) {
  const sectionComponents = SECTION_COMPONENTS.filter(
    (name) => config.components[name]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-3">
        {sectionComponents.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No sections available
          </div>
        ) : (
          <Drawer>
            {sectionComponents.map((name) => (
              <Drawer.Item key={name} name={name}>
                {() => <ComponentItem name={name} />}
              </Drawer.Item>
            ))}
          </Drawer>
        )}
      </div>
    </div>
  );
}
