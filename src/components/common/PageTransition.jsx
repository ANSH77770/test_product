import React from 'react';
import { motion } from 'framer-motion';
import { pageTransitions } from '@/lib/animations';
import { cn } from '@/lib/cn';

/**
 * Reusable Framer Motion page transition wrapper for route changes.
 * @param {object} props - Component props including children and className.
 */
export const PageTransition = ({ children, className }) => {
  return (
    <motion.div
      variants={pageTransitions}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn('w-full flex justify-center items-center', className)}
    >
      {children}
    </motion.div>
  );
};
