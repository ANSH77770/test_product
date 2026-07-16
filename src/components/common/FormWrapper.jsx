import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Accessible and reusable HTML form wrapper preventing default submission behaviors.
 * @param {object} props - Component props including onSubmit handler, children, and className.
 */
export const FormWrapper = ({ onSubmit, children, className, ...props }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn('space-y-5 w-full', className)}
      {...props}
    >
      {children}
    </form>
  );
};
