import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { InputError } from '@/components/common/InputError';
import { focusInputVariants } from '@/lib/animations';
import { cn } from '@/lib/cn';

/**
 * Enterprise Email Input field with integrated mail icon, floating/header label, and focus animation.
 * @param {object} props - Component props including value, onChange, error, disabled, and id.
 */
export const EmailInput = ({
  value,
  onChange,
  error,
  disabled = false,
  id = 'email-input',
  placeholder = 'name@enterprise.com',
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn('w-full flex flex-col space-y-1', className)}>
      {/* Header Label */}
      <div className="flex justify-between items-center mb-1">
        <label
          htmlFor={id}
          className={cn(
            'text-xs font-bold uppercase tracking-wider transition-colors duration-200 select-none cursor-pointer',
            isFocused ? 'text-primary' : 'text-slate-700 dark:text-slate-300',
            error && 'text-destructive'
          )}
        >
          Email Address
        </label>
        <span className="text-[11px] text-slate-400 font-medium">Work or personal</span>
      </div>

      {/* Input Container with Focus Animation */}
      <motion.div
        variants={focusInputVariants}
        animate={isFocused ? 'focus' : 'initial'}
        className={cn(
          'relative flex items-center rounded-xl transition-all duration-200 bg-white dark:bg-slate-900 border shadow-sm group',
          isFocused
            ? 'border-primary ring-4 ring-primary/15 dark:ring-primary/25 z-10'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
          error && 'border-destructive ring-4 ring-destructive/15 dark:border-destructive',
          disabled && 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-950'
        )}
      >
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-3.5 pl-4 pr-11 text-sm font-medium text-slate-900 dark:text-white bg-transparent border-none focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 disabled:cursor-not-allowed tracking-normal"
        />

        {/* Icon Slot */}
        <div className="absolute right-4 pointer-events-none flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors">
          <Mail className="w-4 h-4" />
        </div>
      </motion.div>

      {/* Validation Error UI */}
      <InputError message={error} />
    </div>
  );
};
