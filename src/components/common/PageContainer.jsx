import React from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { cn } from '@/lib/cn';

/**
 * Top-level responsive page container providing full height viewport and gradient atmosphere.
 * @param {object} props - Component props including children and className.
 */
export const PageContainer = ({ children, className }) => {
  return (
    <AnimatedBackground className={cn('flex items-center justify-center', className)}>
      <main className="w-full max-w-7xl mx-auto flex items-center justify-center px-2 sm:px-4 md:px-6">
        {children}
      </main>
    </AnimatedBackground>
  );
};
