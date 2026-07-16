import React from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { buttonAnimations } from '@/lib/animations';
import { cn } from '@/lib/cn';

/**
 * Enterprise Primary CTA Button with integrated states: Normal, Hover, Pressed, Loading, and Disabled.
 * @param {object} props - Component props including isLoading, disabled, children, and type.
 */
export const PrimaryButton = ({
  children,
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? buttonAnimations.hover : undefined}
      whileTap={!isDisabled ? buttonAnimations.tap : undefined}
      className={cn(
        'relative w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white tracking-wide shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 select-none overflow-hidden',
        !isDisabled &&
          'bg-gradient-to-r from-primary via-primary-600 to-primary-700 hover:from-primary-600 hover:to-primary-800 active:from-primary-700 active:to-primary-900 shadow-primary/25 hover:shadow-primary/40 cursor-pointer',
        isDisabled &&
          'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 shadow-none cursor-not-allowed border border-slate-300/50 dark:border-slate-700/50',
        className
      )}
      {...props}
    >
      {/* Subtle shine effect */}
      {!isDisabled && (
        <span className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] transform -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none" />
      )}

      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" className="text-current" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};
