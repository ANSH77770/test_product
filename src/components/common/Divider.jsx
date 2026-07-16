import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Modern visual divider with optional centered label text ("OR").
 * @param {object} props - Component props including label text and className.
 */
export const Divider = ({ text = 'OR', className }) => {
  return (
    <div className={cn('relative my-6 flex items-center justify-center w-full', className)}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
        <span className="bg-white dark:bg-slate-900 px-3 py-1 text-slate-400 dark:text-slate-500 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {text}
        </span>
      </div>
    </div>
  );
};
