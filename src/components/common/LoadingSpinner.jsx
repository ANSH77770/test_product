import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

/**
 * Reusable animated loading spinner component.
 * @param {object} props - Component props including size and className.
 */
export const LoadingSpinner = ({ size = 'md', className }) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        className={cn(
          'animate-spin text-current transition-all duration-300',
          sizes[size] || sizes.md,
          className
        )}
      />
    </div>
  );
};
