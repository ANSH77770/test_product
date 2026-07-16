import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Responsive Split Layout for enterprise login screens (Left Brand Panel, Right Auth Card).
 * @param {object} props - Component props including leftPanel and rightPanel slots.
 */
export const SplitLayout = ({ leftPanel, rightPanel, className }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center justify-center w-full min-h-[calc(100vh-3rem)] max-w-7xl mx-auto py-6 px-2 sm:px-4',
        className
      )}
    >
      {/* Left Brand Panel (Hidden on Mobile/Tablet, visible on lg+) */}
      <div className="hidden lg:block lg:col-span-7 xl:col-span-7 h-full flex items-center justify-center">
        <div className="w-full h-full flex flex-col justify-center">{leftPanel}</div>
      </div>

      {/* Right Auth Card Panel */}
      <div className="col-span-1 lg:col-span-5 xl:col-span-5 flex items-center justify-center w-full">
        {rightPanel}
      </div>
    </div>
  );
};
