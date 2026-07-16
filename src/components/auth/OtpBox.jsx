import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { focusInputVariants } from '@/lib/animations';
import { cn } from '@/lib/cn';

/**
 * Single verification code box for the 6-digit OTP input grid.
 * @param {object} props - Component props including index, value, ref, and event handlers.
 */
export const OtpBox = ({
  index,
  value,
  onChange,
  onKeyDown,
  onPaste,
  onFocus,
  inputRef,
  disabled = false,
  error = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      variants={focusInputVariants}
      animate={isFocused ? 'focus' : 'initial'}
      className={cn(
        'relative flex items-center justify-center rounded-xl transition-all duration-200 w-11 sm:w-14 h-12 sm:h-16 bg-white dark:bg-slate-900 border shadow-sm',
        isFocused
          ? 'border-primary ring-4 ring-primary/20 dark:ring-primary/30 z-10 scale-105'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
        error && 'border-destructive ring-4 ring-destructive/20 dark:border-destructive',
        value && !isFocused && 'border-primary/50 dark:border-blue-500/50 bg-primary/[0.02] dark:bg-blue-500/[0.04]',
        disabled && 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-950'
      )}
    >
      <input
        ref={(el) => (inputRef.current[index] = el)}
        type="text"
        inputMode="numeric"
        autoComplete={index === 0 ? 'one-time-code' : 'off'}
        maxLength={1}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange?.(index, e.target.value)}
        onKeyDown={(e) => onKeyDown?.(index, e)}
        onPaste={onPaste}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={() => setIsFocused(false)}
        className="w-full h-full text-center text-lg sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white bg-transparent border-none focus:outline-none selection:bg-primary/20 disabled:cursor-not-allowed leading-none p-0"
        aria-label={`Digit ${index + 1}`}
      />
    </motion.div>
  );
};
