import { useEffect } from 'react';

const EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];

export function useIdleSession({ enabled, timeoutMinutes, onTimeout }) {
  useEffect(() => {
    if (!enabled) return undefined;
    let timer;
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(onTimeout, timeoutMinutes * 60 * 1000);
    };
    EVENTS.forEach((event) => window.addEventListener(event, reset, { passive: true }));
    reset();
    return () => {
      window.clearTimeout(timer);
      EVENTS.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [enabled, timeoutMinutes, onTimeout]);
}
