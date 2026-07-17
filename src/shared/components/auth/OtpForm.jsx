import { useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/Button';

const OTP_LENGTH = 6;

export function OtpForm({ onSubmit, onResend, onBack, loading = false }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const inputs = useRef([]);

  const setDigit = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setDigits((current) => current.map((item, position) => position === index ? digit : item));
    setError('');
    if (digit && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    setDigits(Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] ?? ''));
    inputs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) return setError('Enter the complete 6-digit verification code.');
    onSubmit(code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="otp-group" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => { inputs.current[index] = element; }}
            className="otp-input"
            value={digit}
            onChange={(event) => setDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`OTP digit ${index + 1}`}
            maxLength={1}
          />
        ))}
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
      <Button type="submit" loading={loading}>Verify OTP</Button>
      <div className="otp-actions">
        <button type="button" className="link-button" onClick={onBack}>Change email</button>
        <button type="button" className="link-button" onClick={onResend}>Resend code</button>
      </div>
    </form>
  );
}
