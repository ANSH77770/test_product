import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Reusable card header component with heading, subtitle, and optional logo or icon slot.
 * @param {object} props - Component props including title, subtitle, logoSlot, and className.
 */
export const CardHeader = ({ title, subtitle, logoSlot, className }) => {
  return (
    <div className={cn('flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 mb-6', className)}>
      {logoSlot && <div className="mb-2">{logoSlot}</div>}
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
};
