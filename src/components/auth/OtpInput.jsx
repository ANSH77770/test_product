import React from 'react';
import { OtpBox } from './OtpBox';
import { InputError } from '@/components/common/InputError';
import { OTP_LENGTH } from '@/lib/constants';
import { cn } from '@/lib/cn';

/**
 * 6-box OTP verification code input grid supporting auto-advance, backspace navigation, and paste.
 * @param {object} props - Component props including otpValues, inputRefs, and event handlers.
 */
export const OtpInput = ({
  length = OTP_LENGTH,
  otpValues,
  inputRefs,
  onChange,
  onKeyDown,
  onPaste,
  onFocus,
  error,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('w-full flex flex-col items-center space-y-2', className)}>
      <div className="flex justify-between items-center gap-2 sm:gap-3.5 w-full">
        {Array.from({ length }).map((_, index) => (
          <OtpBox
            key={index}
            index={index}
            value={otpValues[index]}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            onFocus={onFocus}
            inputRef={inputRefs}
            disabled={disabled}
            error={Boolean(error)}
          />
        ))}
      </div>
      <div className="w-full">
        <InputError message={error} />
      </div>
    </div>
  );
};
