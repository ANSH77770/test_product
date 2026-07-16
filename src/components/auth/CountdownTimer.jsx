import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Countdown timer and interactive resend code action button.
 * @param {object} props - Component props including isRunning, formattedTime, onResend, and disabled.
 */
export const CountdownTimer = ({
  isRunning,
  formattedTime,
  onResend,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 py-2', className)}>
      {isRunning ? (
        <div className="flex items-center gap-1.5 select-none">
          <span>Resend code in</span>
          <span className="font-mono font-bold text-primary dark:text-blue-400 px-1.5 py-0.5 rounded bg-primary/10 dark:bg-blue-500/10">
            {formattedTime}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span>Didn&apos;t receive the code?</span>
          <motion.button
            type="button"
            onClick={onResend}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.03 } : undefined}
            whileTap={!disabled ? { scale: 0.97 } : undefined}
            className={cn(
              'font-bold text-primary dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 cursor-pointer underline-offset-4 hover:underline select-none',
              disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
          >
            <RefreshCw className="w-3 h-3" />
            <span>Resend Code</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
