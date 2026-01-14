'use client';

import { FieldLabel } from '@puckeditor/core';

type CheckboxOption = {
  label: string;
  value: string;
};

type CheckboxGroupFieldProps = {
  label: string;
  options: CheckboxOption[];
  value?: string[];
  onChange: (value: string[]) => void;
  helperText?: string;
};

export function CheckboxGroupField({
  label,
  options,
  value = [],
  onChange,
  helperText,
}: CheckboxGroupFieldProps) {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel label={label} />
      {helperText ? (
        <p className="text-xs text-gray-500">{helperText}</p>
      ) : null}
      <div className="flex flex-col gap-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 rounded border border-transparent px-2 py-1 text-sm font-medium text-gray-700 hover:border-gray-200"
          >
            <input
              type="checkbox"
              className="text-primary focus:ring-primary size-4 rounded border-gray-300"
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}
            />
            <span className="text-gray-900">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
