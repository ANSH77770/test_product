import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { validatePassword } from '@/lib/passwordPolicy';
import { authService } from '@/services/authService';
import { AuthHeading, AuthSplitLayout, BrandPanel, Button, PasswordInput, PasswordRequirements, TextInput } from '@/shared/components';

export function PasswordReset() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: state?.email || '', otp: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const update = (field) => (event) => {
    const value = field === 'otp' ? event.target.value.replace(/\D/g, '').slice(0, 6) : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (!/^\d{6}$/.test(form.otp)) nextErrors.otp = 'Enter the complete 6-digit reset code.';
    const passwordError = validatePassword(form.password, { email: form.email });
    if (passwordError) nextErrors.password = passwordError;
    if (form.password !== form.confirm) nextErrors.confirm = 'New password and confirmation do not match.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    setApiError('');
    try {
      await authService.resetPassword({ email: form.email, otp: form.otp, newPassword: form.password });
      setResetComplete(true);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setApiError('');
    setResendMessage('');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setErrors((current) => ({ ...current, email: 'Enter a valid email address.' }));
      return;
    }
    try {
      await authService.requestPasswordReset(form.email);
      setResendMessage('If that email is registered, a new reset code has been sent.');
    } catch (error) {
      if (error.status >= 500 || error.status === 0) setApiError(error.message);
      else setResendMessage('If that email is registered, a new reset code has been sent.');
    }
  };

  return (
    <AuthSplitLayout brandPanel={<BrandPanel />}>
      <AuthHeading title="Reset password" subtitle="Enter the reset code and choose a new password." />
      {apiError && <div className="notice-error" role="alert">{apiError}</div>}
      {resetComplete ? (
        <div className="success-state" role="status">
          <div className="success-icon">✓</div>
          <div className="notice-success">Your password has been reset successfully.</div>
          <Button type="button" onClick={() => navigate('/login', { replace: true })}>Continue to log in</Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <TextInput id="reset-password-email" label="Email" type="email" required autoComplete="email" value={form.email} onChange={update('email')} error={errors.email} />
          <TextInput id="reset-password-otp" label="6-digit reset code" required inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={form.otp} onChange={update('otp')} error={errors.otp} />
          <PasswordInput id="reset-new-password" label="New password" required autoComplete="new-password" value={form.password} onChange={update('password')} error={errors.password} />
          <PasswordRequirements password={form.password} identity={{ email: form.email }} />
          <PasswordInput id="reset-confirm-password" label="Confirm new password" required autoComplete="new-password" value={form.confirm} onChange={update('confirm')} error={errors.confirm} />
          <Button type="submit" loading={loading}>Reset password</Button>
          <div className="otp-actions">
            <button type="button" className="link-button" onClick={() => navigate('/forgot-password')}>Change email</button>
            <button type="button" className="link-button" onClick={resend}>Resend code</button>
          </div>
          {resendMessage && <p className="reset-resend-message" role="status">{resendMessage}</p>}
        </form>
      )}
    </AuthSplitLayout>
  );
}
