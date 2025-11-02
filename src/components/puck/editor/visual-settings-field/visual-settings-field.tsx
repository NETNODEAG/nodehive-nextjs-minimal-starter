'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { BackgroundColor, SpacingSize } from '@/types/visual-settings';

const spacingOptions = [
  { label: 'None', value: 'none' },
  { label: 'Small', value: 'small' },
  { label: 'Large', value: 'large' },
];

const backgroundColorOptions = [
  { label: 'White', value: 'white' },
  { label: 'Gray', value: 'gray' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Red', value: 'red' },
  { label: 'Orange', value: 'orange' },
  { label: 'Purple', value: 'purple' },
];

export type VisualSettingsFieldProps = {
  value?: {
    topSpacing?: SpacingSize;
    bottomSpacing?: SpacingSize;
    backgroundColor?: BackgroundColor;
  };
  onChange: (value: VisualSettingsFieldProps['value']) => void;
  showSpacing?: boolean;
  showBackground?: boolean;
  label?: string;
};

export default function VisualSettingsField({
  value = {},
  onChange,
  showSpacing = true,
  showBackground = true,
  label = 'Visual Settings',
}: VisualSettingsFieldProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  const handleChange = (key: string, val: string) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <button
        type="button"
        onClick={toggleAccordion}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
      >
        <span>{label}</span>
        <span>
          {expanded ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </span>
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-gray-200 px-4 py-4">
          {showSpacing && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Abstand oben
                </label>
                <select
                  className="block w-full rounded-md border border-gray-300 py-1.5 pr-8 pl-3 text-sm"
                  value={value.topSpacing || ''}
                  onChange={(e) => handleChange('topSpacing', e.target.value)}
                >
                  {spacingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Abstand unten
                </label>
                <select
                  className="block w-full rounded-md border border-gray-300 py-1.5 pr-8 pl-3 text-sm"
                  value={value.bottomSpacing || ''}
                  onChange={(e) =>
                    handleChange('bottomSpacing', e.target.value)
                  }
                >
                  {spacingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {showBackground && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Hintergrundfarbe
              </label>
              <select
                className="block w-full rounded-md border border-gray-300 py-1.5 pr-8 pl-3 text-sm"
                value={value.backgroundColor || ''}
                onChange={(e) =>
                  handleChange('backgroundColor', e.target.value)
                }
              >
                {backgroundColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
