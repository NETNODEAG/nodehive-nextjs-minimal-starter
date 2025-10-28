'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/atoms/button/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('pointer-events-auto p-3', className)}
      classNames={{
        month: 'space-y-4',
        months:
          'flex flex-col sm:flex-row space-y-4 sm:space-y-0 relative gap-2',
        month_caption: 'flex justify-center pt-1 relative items-center',
        month_grid: 'w-full border-collapse space-y-1',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center justify-between absolute inset-x-0',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'z-10 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'z-10 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        weeks: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-none first:aria-selected:rounded-l-md last:aria-selected:rounded-r-md',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'relative h-9 w-9 rounded-md p-0 text-center text-sm focus-within:relative focus-within:z-20'
        ),
        range_start:
          'day-range-start bg-gray-50 rounded-l-md [&>button]:bg-eco-primary-orange [&>button]:text-black [&>button]:hover:bg-eco-primary-orange [&>button]:hover:text-black',
        range_end:
          'day-range-end bg-gray-50 rounded-r-md [&>button]:bg-eco-primary-orange [&>button]:text-black [&>button]:hover:bg-eco-primary-orange [&>button]:hover:text-black',
        range_middle: 'aria-selected:bg-gray-100 aria-selected:text-black',
        selected: cn(
          props.mode === 'range'
            ? 'bg-eco-primary-orange hover:bg-eco-primary-orange focus:bg-eco-primary-orange hover:text-black focus:text-black'
            : '[&>button]:bg-eco-primary-orange [&>button]:hover:bg-eco-primary-orange rounded-md! [&>button]:text-black [&>button]:hover:text-black'
        ),
        today: 'bg-gray-100 text-black rounded-md!',
        outside:
          'day-outside text-gray-500 opacity-50 !aria-selected:bg-gray-50/50 !aria-selected:text-gray-500 !aria-selected:opacity-30',
        disabled: 'text-gray-500 opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) =>
          props.orientation === 'left' ? (
            <ChevronLeft {...props} className="h-4 w-4" />
          ) : (
            <ChevronRight {...props} className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
