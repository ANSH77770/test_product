import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { EmailInput } from '@/components/auth/EmailInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { FormWrapper } from '@/components/common/FormWrapper';
import { OtpInput } from '@/components/auth/OtpInput';
import { CountdownTimer } from '@/components/auth/CountdownTimer';
import { useLoading } from '@/hooks/useLoading';
import { useCountdown } from '@/hooks/useCountdown';
import { useOtpInput } from '@/hooks/useOtpInput';
import { emailPasswordSchema, otpValidationSchema } from '@/lib/validation';
import { OTP_TIMER_DURATION, OTP_LENGTH } from '@/lib/constants';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Unified authentication page: first asks for Email & Password, then shows OTP verification (sent to the email).
 * No split‑screen branding panel – everything is centered in a single AuthCard.
 */
export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, withLoading } = useLoading(false);

  // ----- Step management -----
  const [step, setStep] = useState('login'); // 'login' | 'otp' | 'success'
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});
  const [otpError, setOtpError] = useState(null);

  // ----- OTP / Timer hooks -----
  const { isRunning, formattedTime, startTimer } = useCountdown(OTP_TIMER_DURATION);
  const {
    otpValues,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
    resetOtp,
    otpString,
  } = useOtpInput(OTP_LENGTH, () => {
    setOtpError(null);
  });

  // ----- Email/Password submit -----
  const handleLoginSubmit = async () => {
    const result = emailPasswordSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setLoginErrors(fieldErrors);
      return;
    }
    setLoginErrors({});
    await withLoading(async () => {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate('/otp-verification', { state: { email } });
    });
  };

  // ----- OTP verification -----
  const handleVerify = async () => {
    const result = otpValidationSchema.safeParse({ otp: otpString });
    if (!result.success) {
      setOtpError(result.error.errors[0]?.message || 'Invalid OTP');
      return;
    }
    setOtpError(null);
    await withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      setStep('success');
    });
  };

  const handleResendOtp = async () => {
    if (isRunning || isLoading) return;
    await withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      resetOtp();
      setOtpError(null);
      startTimer();
    });
  };

  const handleChangeEmail = () => {
    setStep('login');
    resetOtp();
    setOtpError(null);
  };

  // ----- Render -----
  return (
    <AuthLayout className="py-8">
      <div className="w-full flex justify-center items-center">
        <AuthCard
          title={step === 'login' ? 'Sign In' : step === 'otp' ? 'Verify Your Identity' : 'Success'}
          subtitle={
            step === 'login' ? (
              'Enter your email and password to access your workspace.'
            ) : step === 'otp' ? (
              <span>
                Enter the 6‑digit verification code sent to{' '}
                <strong className="text-slate-900 dark:text-white font-mono font-bold tracking-tight">
                  {email || 'your@email.com'}
                </strong>
              </span>
            ) : (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Your session is authenticated. You may now navigate to your app.
              </span>
            )
          }
          showLogo={true}
        >
          {step === 'login' && (
            <FormWrapper onSubmit={handleLoginSubmit}>
              <EmailInput
                value={email}
                onChange={(val) => {
                  setEmail(val);
                  if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: null }));
                }}
                error={loginErrors.email}
                disabled={isLoading}
              />
              <PasswordInput
                value={password}
                onChange={(val) => {
                  setPassword(val);
                  if (loginErrors.password) setLoginErrors((prev) => ({ ...prev, password: null }));
                }}
                error={loginErrors.password}
                disabled={isLoading}
              />
              <div className="pt-2">
                <PrimaryButton type="submit" isLoading={isLoading} disabled={!email || !password}>
                  Sign In
                </PrimaryButton>
              </div>
            </FormWrapper>
          )}

          {step === 'otp' && (
            <FormWrapper onSubmit={handleVerify}>
              <OtpInput
                length={OTP_LENGTH}
                otpValues={otpValues}
                inputRefs={inputRefs}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onFocus={handleFocus}
                error={otpError}
                disabled={isLoading}
              />
              <CountdownTimer
                isRunning={isRunning}
                formattedTime={formattedTime}
                onResend={handleResendOtp}
                disabled={isLoading || isRunning}
              />
              <div className="pt-2 space-y-3">
                <PrimaryButton type="submit" isLoading={isLoading} disabled={otpString.length !== OTP_LENGTH}>
                  Verify OTP
                </PrimaryButton>
                <SecondaryButton type="button" onClick={handleChangeEmail} disabled={isLoading}>
                  Change Email Address
                </SecondaryButton>
              </div>
            </FormWrapper>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center text-center space-y-4 select-none">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Successful</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                Your session has been securely authenticated. Feel free to explore the demo.
              </p>
              <PrimaryButton onClick={() => { setStep('login'); resetOtp(); }}>Return to Login Demo</PrimaryButton>
            </div>
          )}
        </AuthCard>
      </div>
    </AuthLayout>
  );
};

export default Login;
