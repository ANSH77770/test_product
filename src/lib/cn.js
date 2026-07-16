import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names conditionally using clsx and merges Tailwind utility classes using tailwind-merge.
 * @param {...import('clsx').ClassValue} inputs - Class values to combine and merge.
 * @returns {string} Optimized className string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
