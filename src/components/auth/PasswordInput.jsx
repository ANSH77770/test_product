import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { InputError } from '@/components/common/InputError';
import { focusInputVariants } from '@/lib/animations';
import { cn } from '@/lib/cn';

/**
 * Enterprise Password Input field with show/hide toggle, lock icon, and focus animation.
 * @param {object} props - Component props including value, onChange, error, disabled, and id.
 */
export const PasswordInput = ({
  value,
  onChange,
  error,
  disabled = false,
  id = 'password-input',
  placeholder = '••••••••••••',
  showForgotLink = true,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          Password
        </label>
        {showForgotLink && (
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              alert('Forgot password demonstration mode.');
            }}
            className="text-[11px] text-primary dark:text-blue-400 font-semibold hover:underline cursor-pointer"
          >
            Forgot password?
          </a>
        )}
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
        {/* Left Lock Icon */}
        <div className="absolute left-3.5 pointer-events-none flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-3.5 pl-10 pr-11 text-sm font-medium text-slate-900 dark:text-white bg-transparent border-none focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 disabled:cursor-not-allowed tracking-normal"
        />

        {/* Right Toggle Visibility Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors focus:outline-none p-1 rounded-md cursor-pointer disabled:cursor-not-allowed"
          title={showPassword ? 'Hide password' : 'Show password'}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </motion.div>

      {/* Validation Error UI */}
      <InputError message={error} />
    </div>
  );
};
