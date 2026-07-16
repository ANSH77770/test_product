import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Reusable layout wrapper for grouping form elements with clean spacing and structure.
 * @param {object} props - Component props including children and className.
 */
export const FormSection = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 relative w-full', className)}>
      {children}
    </div>
  );
};
