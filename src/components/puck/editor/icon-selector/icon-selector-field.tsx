import React, { useState } from 'react';
import { FieldLabel } from '@measured/puck';
import * as LucideIcons from 'lucide-react';
import { ChevronDown, X } from 'lucide-react';

// Popular icons commonly used for navigation and CTAs
const POPULAR_ICONS = [
  'ArrowRight',
  'ExternalLink',
  'Download',
  'Mail',
  'Phone',
  'MapPin',
  'Calendar',
  'Clock',
  'Users',
  'User',
  'Home',
  'Info',
  'Settings',
  'Search',
  'Menu',
  'X',
  'Plus',
  'Minus',
  'Check',
  'Star',
  'Heart',
  'Share2',
  'Edit',
  'Trash2',
  'Eye',
  'Lock',
  'Unlock',
  'Bell',
  'MessageCircle',
  'ShoppingCart',
  'CreditCard',
  'FileText',
  'Image',
  'Video',
  'Music',
  'PlayCircle',
  'PauseCircle',
  'StopCircle',
  'SkipForward',
  'SkipBack',
  'Volume2',
  'VolumeX',
  'Wifi',
  'Globe',
  'Smartphone',
  'Laptop',
  'Monitor',
  'Tablet',
  'Camera',
  'Printer',
  'Database',
  'Server',
  'Cloud',
  'Folder',
  'File',
  'Archive',
  'Package',
  'Truck',
  'Zap',
  'Award',
  'Target',
  'TrendingUp',
  'BarChart',
  'PieChart',
  'Activity',
  'Shield',
  'CheckCircle',
  'AlertCircle',
  'AlertTriangle',
  'HelpCircle',
  'Lightbulb',
  'Rocket',
  'Flag',
  'Bookmark',
  'Tag',
  'Hash',
  'Link',
  'Paperclip',
  'Send',
  'Inbox',
  'Filter',
  'Grid',
  'List',
  'Layout',
  'Maximize2',
  'Minimize2',
  'MoreHorizontal',
  'MoreVertical',
  'ChevronUp',
  'ChevronDown',
  'ChevronLeft',
  'ChevronRight',
] as const;

type IconName = (typeof POPULAR_ICONS)[number];

interface IconSelectorFieldProps {
  onChange: (value: IconName | string) => void;
  value: IconName | string;
  label: string;
  placeholder?: string;
}

const IconSelectorField = ({
  onChange,
  value,
  label,
  placeholder = 'Select an icon...',
}: IconSelectorFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = POPULAR_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(search.toLowerCase())
  );

  const SelectedIconComponent = value
    ? (LucideIcons[value as keyof typeof LucideIcons] as React.ComponentType<
        React.SVGProps<SVGSVGElement>
      >)
    : null;

  const handleSelect = (iconName: IconName) => {
    onChange(iconName);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative">
      <FieldLabel label={label} />

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2">
          {SelectedIconComponent && (
            <SelectedIconComponent className="h-4 w-4" />
          )}
          <span
            className={
              SelectedIconComponent ? 'text-gray-900' : 'text-gray-500'
            }
          >
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {/* Search */}
          <div className="border-b p-2">
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Icon List */}
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredIcons.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-gray-500">
                No icons found
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {filteredIcons.map((iconName) => {
                  const IconComponent = LucideIcons[
                    iconName as keyof typeof LucideIcons
                  ] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
                  if (!IconComponent) return null;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleSelect(iconName)}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
                    >
                      <IconComponent className="h-4 w-4 shrink-0" />
                      <span className="truncate">{iconName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            setIsOpen(false);
          }}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default IconSelectorField;
export { POPULAR_ICONS };
export type { IconName };
