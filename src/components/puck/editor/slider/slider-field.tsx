import { useState } from 'react';

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const SliderField = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: SliderFieldProps) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
          {value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className={`slider-thumb:appearance-none slider-thumb:h-5 slider-thumb:w-5 slider-thumb:rounded-full slider-thumb:bg-blue-600 slider-thumb:cursor-pointer slider-thumb:border-2 slider-thumb:border-white slider-thumb:shadow-lg slider-thumb:transition-all slider-thumb:duration-150 hover:slider-thumb:bg-blue-700 hover:slider-thumb:scale-110 focus:ring-opacity-50 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDragging ? 'slider-thumb:scale-110 slider-thumb:bg-blue-700' : ''} `}
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
              ((value - min) / (max - min)) * 100
            }%, #E5E7EB ${((value - min) / (max - min)) * 100}%, #E5E7EB 100%)`,
          }}
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};
