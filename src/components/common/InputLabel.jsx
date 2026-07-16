import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/cn';

/**
 * Enterprise form input label with optional required asterisk indicator.
 * @param {object} props - Component props including required flag, htmlFor, and children.
 */
export const InputLabel = ({ htmlFor, children, required = false, className, ...props }) => {
  return (
    <LabelPrimitive.Root
      htmlFor={htmlFor}
      className={cn(
        'block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 select-none',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </LabelPrimitive.Root>
  );
};
