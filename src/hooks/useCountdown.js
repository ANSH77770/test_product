import { useState, useEffect, useCallback } from 'react';
import { OTP_TIMER_DURATION } from '@/lib/constants';

/**
 * Custom hook to manage a countdown timer for OTP resend capability.
 * @param {number} initialDuration - Duration in seconds.
 * @returns {object} Countdown states and controls.
 */
export const useCountdown = (initialDuration = OTP_TIMER_DURATION) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let timerId;
    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeLeft]);

  const startTimer = useCallback(() => {
    setTimeLeft(initialDuration);
    setIsRunning(true);
  }, [initialDuration]);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialDuration);
    setIsRunning(false);
  }, [initialDuration]);

  const formattedTime = `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`;

  return {
    timeLeft,
    isRunning,
    isExpired: timeLeft === 0,
    formattedTime,
    startTimer,
    resetTimer,
  };
};
