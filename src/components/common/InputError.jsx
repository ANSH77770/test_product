import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { inputErrorVariants } from '@/lib/animations';
import { cn } from '@/lib/cn';

/**
 * Animated input validation error message component.
 * @param {object} props - Component props including validation error message string.
 */
export const InputError = ({ message, className }) => {
  return (
    <AnimatePresence mode="wait">
      {message ? (
        <motion.div
          key="error"
          variants={inputErrorVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium text-destructive mt-1.5 px-0.5',
            className
          )}
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
