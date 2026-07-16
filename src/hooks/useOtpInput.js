import { useState, useRef, useCallback } from 'react';
import { OTP_LENGTH } from '@/lib/constants';

/**
 * Custom hook to manage multi-box OTP input interactions, auto-focus, backspace navigation, and paste support.
 * @param {number} length - Number of OTP boxes.
 * @param {function} onComplete - Callback when all boxes are filled with digits.
 * @returns {object} States and handlers for OTP input boxes.
 */
export const useOtpInput = (length = OTP_LENGTH, onComplete) => {
  const [otpValues, setOtpValues] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const focusInput = useCallback((index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
      inputRefs.current[index].select();
    }
  }, []);

  const handleChange = useCallback(
    (index, value) => {
      // Ensure only numeric digits
      const cleanedValue = value.replace(/\D/g, '');
      if (!cleanedValue && value !== '') return;

      const newOtpValues = [...otpValues];
      // Take the last entered character if multiple typed rapidly
      const digit = cleanedValue.slice(-1);
      newOtpValues[index] = digit;
      setOtpValues(newOtpValues);

      const otpString = newOtpValues.join('');

      // Auto move forward
      if (digit && index < length - 1) {
        focusInput(index + 1);
      }

      // Check completion
      if (otpString.length === length && !newOtpValues.includes('')) {
        onComplete?.(otpString);
      }
    },
    [otpValues, length, focusInput, onComplete]
  );

  const handleKeyDown = useCallback(
    (index, event) => {
      if (event.key === 'Backspace') {
        if (!otpValues[index] && index > 0) {
          // If current is empty, move back and clear previous
          const newOtpValues = [...otpValues];
          newOtpValues[index - 1] = '';
          setOtpValues(newOtpValues);
          focusInput(index - 1);
        } else {
          // Clear current box
          const newOtpValues = [...otpValues];
          newOtpValues[index] = '';
          setOtpValues(newOtpValues);
        }
      } else if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        focusInput(index - 1);
      } else if (event.key === 'ArrowRight' && index < length - 1) {
        event.preventDefault();
        focusInput(index + 1);
      }
    },
    [otpValues, length, focusInput]
  );

  const handlePaste = useCallback(
    (event) => {
      event.preventDefault();
      const pasteData = event.clipboardData.getData('text').replace(/\D/g, '');
      if (!pasteData) return;

      const digits = pasteData.slice(0, length).split('');
      const newOtpValues = Array(length).fill('');
      
      digits.forEach((digit, idx) => {
        if (idx < length) {
          newOtpValues[idx] = digit;
        }
      });

      setOtpValues(newOtpValues);

      const otpString = newOtpValues.join('');
      const nextFocusIdx = Math.min(digits.length, length - 1);
      focusInput(nextFocusIdx);

      if (otpString.length === length && !newOtpValues.includes('')) {
        onComplete?.(otpString);
      }
    },
    [length, focusInput, onComplete]
  );

  const handleFocus = useCallback((event) => {
    event.target.select();
  }, []);

  const resetOtp = useCallback(() => {
    setOtpValues(Array(length).fill(''));
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [length]);

  return {
    otpValues,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
    resetOtp,
    otpString: otpValues.join(''),
  };
};
