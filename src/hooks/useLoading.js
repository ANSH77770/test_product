import { useState, useCallback } from 'react';

/**
 * Custom hook to manage asynchronous loading states cleanly.
 * @param {boolean} initialLoading - Initial loading boolean state.
 * @returns {object} Loading state and control functions.
 */
export const useLoading = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  const withLoading = useCallback(
    async (asyncFn) => {
      try {
        startLoading();
        return await asyncFn();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};
