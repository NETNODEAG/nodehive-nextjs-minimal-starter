'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import {
  AccordionContent,
  AccordionItem,
  Accordion as AccordionPrimitive,
  AccordionTrigger,
} from '@/components/ui/atoms/accordion/accordion';

export interface AccordionEntry {
  question: string;
  content: ReactNode;
}

export interface AccordionProps {
  items?: AccordionEntry[];
  isEditing?: boolean;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items = [],
  isEditing = false,
  className,
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing) {
      setOpenItems(items.map((_, index) => `item-${index}`));
    }
  }, [isEditing, items]);

  return (
    <AccordionPrimitive
      type="multiple"
      className={cn('w-full', className)}
      value={openItems}
      onValueChange={setOpenItems}
    >
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </AccordionPrimitive>
  );
};

export default Accordion;
