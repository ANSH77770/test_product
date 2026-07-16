import React from 'react';
import { FloatingShapes } from './FloatingShapes';
import { cn } from '@/lib/cn';

/**
 * Animated soft gradient background with floating glassmorphism shapes.
 * @param {object} props - Component props including children and className.
 */
export const AnimatedBackground = ({ children, className }) => {
  return (
    <div
      className={cn(
        'relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8',
        className
      )}
    >
      <FloatingShapes />
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        {children}
      </div>
    </div>
  );
};
