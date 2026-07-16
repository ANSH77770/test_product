import React from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { secondaryButtonAnimations } from '@/lib/animations';
import { cn } from '@/lib/cn';

/**
 * Enterprise Secondary Button for actions like "Change Mobile Number" or "Resend OTP".
 * @param {object} props - Component props including isLoading, disabled, children, and onClick.
 */
export const SecondaryButton = ({
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
      whileHover={!isDisabled ? secondaryButtonAnimations.hover : undefined}
      whileTap={!isDisabled ? secondaryButtonAnimations.tap : undefined}
      className={cn(
        'w-full py-3 px-5 rounded-xl font-semibold text-sm tracking-tight transition-all duration-200 flex items-center justify-center gap-2 select-none border',
        !isDisabled &&
          'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 shadow-sm cursor-pointer',
        isDisabled &&
          'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" className="text-current" />
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};
