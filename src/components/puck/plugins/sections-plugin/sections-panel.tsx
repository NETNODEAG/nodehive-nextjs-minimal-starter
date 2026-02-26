'use client';

import { useState } from 'react';
import { Config, Drawer } from '@puckeditor/core';
import { SearchIcon, XIcon } from 'lucide-react';

import ComponentItem from '@/components/puck/editor/component-item';

type SectionsPanelProps = {
  config: Config;
};

const SECTION_COMPONENTS = ['Hero', 'ContentSection'];

export function SectionsPanel({ config }: SectionsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const sectionComponents = SECTION_COMPONENTS.filter((name) => {
    if (!config.components[name]) return false;
    if (!searchQuery) return true;
    const label = config.components[name]?.label || name;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b border-gray-200 p-3">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sections..."
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

      {/* Section List */}
      <div className="flex-1 overflow-y-auto p-3">
        {sectionComponents.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No sections found
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
