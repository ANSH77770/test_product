import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { OtpInput } from '@/components/auth/OtpInput';
import { CountdownTimer } from '@/components/auth/CountdownTimer';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { FormWrapper } from '@/components/common/FormWrapper';
import { useCountdown } from '@/hooks/useCountdown';
import { useOtpInput } from '@/hooks/useOtpInput';
import { useLoading } from '@/hooks/useLoading';
import { otpValidationSchema } from '@/lib/validation';
import { OTP_TIMER_DURATION, OTP_LENGTH } from '@/lib/constants';

/**
 * Enterprise OTP Verification Page confirming the 6-digit code sent to the user's email ID.
 */
export const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve email details passed from Login or provide clean fallback
  const email = location.state?.email || 'alex@enterprise.com';

  const [validationError, setValidationError] = useState(null);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

  const { isRunning, formattedTime, startTimer } = useCountdown(OTP_TIMER_DURATION);
  const { isLoading, withLoading } = useLoading(false);

  const handleVerifySubmission = async (codeToVerify) => {
    const code = typeof codeToVerify === 'string' ? codeToVerify : otpString;

    // Validate using Zod schema
    const result = otpValidationSchema.safeParse({ otp: code });
    if (!result.success) {
      setValidationError(result.error.errors[0]?.message || 'Please enter valid 6-digit code.');
      return;
    }

    setValidationError(null);

    await withLoading(async () => {
      // Simulate enterprise cryptographic verification latency
      await new Promise((resolve) => setTimeout(resolve, 1100));
      setIsVerifiedSuccess(true);
    });
  };

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
    setValidationError(null);
  });

  const handleResendOtp = async () => {
    if (isRunning || isLoading) return;
    await withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      resetOtp();
      setValidationError(null);
      startTimer();
    });
  };

  const handleChangeEmail = () => {
    navigate('/login', { state: { email } });
  };

  const isVerifyDisabled = otpString.length !== OTP_LENGTH || isLoading;

  return (
    <AuthLayout className="py-8">
      <div className="w-full max-w-[480px] flex flex-col items-center">
        <AuthCard
          title="Verify Your Identity"
          subtitle={
            <span>
              Enter the 6-digit verification code sent to{' '}
              <strong className="text-slate-900 dark:text-white font-mono font-bold tracking-tight">
                {email}
              </strong>
            </span>
          }
          showLogo={true}
        >
          <AnimatePresence mode="wait">
            {!isVerifiedSuccess ? (
              <motion.div
                key="verification-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <FormWrapper onSubmit={() => handleVerifySubmission(otpString)}>
                  {/* 6-Box OTP Grid */}
                  <OtpInput
                    length={OTP_LENGTH}
                    otpValues={otpValues}
                    inputRefs={inputRefs}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onFocus={handleFocus}
                    error={validationError}
                    disabled={isLoading}
                  />

                  {/* Countdown Timer & Resend Link */}
                  <CountdownTimer
                    isRunning={isRunning}
                    formattedTime={formattedTime}
                    onResend={handleResendOtp}
                    disabled={isLoading || isRunning}
                  />

                  {/* Primary Verify CTA Button */}
                  <div className="pt-2 space-y-3">
                    <PrimaryButton
                      type="submit"
                      isLoading={isLoading}
                      disabled={isVerifyDisabled}
                    >
                      Verify OTP
                    </PrimaryButton>

                    {/* Secondary Change Email Address Button */}
                    <SecondaryButton
                      type="button"
                      onClick={handleChangeEmail}
                      disabled={isLoading}
                    >
                      Change Email Address
                    </SecondaryButton>
                  </div>
                </FormWrapper>
              </motion.div>
            ) : (
              <motion.div
                key="verification-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 flex flex-col items-center text-center space-y-4 select-none"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Authentication Successful
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                    Your session has been securely authenticated. Redirecting to workspace...
                  </p>
                </div>
                <div className="pt-4 w-full">
                  <PrimaryButton
                    onClick={() => {
                      setIsVerifiedSuccess(false);
                      navigate('/login');
                    }}
                  >
                    Return to Login Demo
                  </PrimaryButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AuthCard>
      </div>
    </AuthLayout>
  );
};

export default OtpVerification;
