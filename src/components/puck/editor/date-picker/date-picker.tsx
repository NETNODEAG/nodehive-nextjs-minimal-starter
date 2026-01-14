'use client';

import { FieldLabel } from '@puckeditor/core';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/atoms/calendar/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/atoms/popover/popover';

type DatePickerProps = {
  date: string;
  onChange: (date: string) => void;
  label: string;
};

export function DatePicker({ date, onChange, label }: DatePickerProps) {
  const handleDateChange = (day: Date | undefined) => {
    if (day) {
      onChange(day.toUTCString());
    }
  };
  return (
    <div>
      <FieldLabel icon={<CalendarIcon className="size-4" />} label={label} />
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex w-full cursor-pointer items-center justify-start gap-2 rounded-sm border border-gray-300 p-3 text-left text-sm font-normal',
              !date && 'text-gray-500'
            )}
          >
            <CalendarIcon className="size-5" />
            {date ? (
              format(new Date(date), 'PPP', { locale: de })
            ) : (
              <span>Datum auswählen</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={new Date(date)}
            onSelect={handleDateChange}
            locale={de}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
