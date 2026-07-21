// Previous name: ChangePasswordPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_CONFIG } from '@/config/authConfig';
import { validatePassword } from '@/lib/passwordPolicy';
import { authService } from '@/services/authService';
import { AuthHeading, AuthSplitLayout, BrandPanel, Button, PasswordInput, PasswordRequirements, TextInput } from '@/shared/components';

export function CredentialUpdate() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ current: '', next: '', confirm: '', otp: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const update = (field) => (event) => setValues((current) => ({
    ...current,
    [field]: field === 'otp' ? event.target.value.replace(/\D/g, '').slice(0, 6) : event.target.value,
  }));

  const requestOtp = async () => {
    setLoading(true);
    setError('');
    setOtpMessage('');
    try {
      await authService.requestPasswordChangeOtp();
      setOtpRequested(true);
      setOtpMessage('A 6-digit verification code was sent to your email.');
    } catch (requestError) {
      setError(requestError.message);
    } finally { setLoading(false); }
  };

  const submit = async (event) => {
    event.preventDefault();
    const policyError = validatePassword(values.next);
    if (policyError) return setError(policyError);
    if (values.next !== values.confirm) return setError('New password and confirmation do not match.');
    if (!otpRequested) return setError('Request a verification code before changing your password.');
    if (!/^\d{6}$/.test(values.otp)) return setError('Enter the complete 6-digit verification code.');
    setLoading(true);
    setError('');
    try {
      await authService.changePassword(values);
      setChanged(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally { setLoading(false); }
  };

  return (
    <AuthSplitLayout brandPanel={<BrandPanel />}>
      <AuthHeading title="Change password" subtitle={`Passwords expire every ${AUTH_CONFIG.passwordPolicy.expiryDays} days and the last ${AUTH_CONFIG.passwordPolicy.historyCount} passwords cannot be reused.`} />
      {changed ? <div className="notice-success">Password changed successfully.</div> : (
        <form onSubmit={submit}>
          <PasswordInput id="current-password" label="Current password" required value={values.current} onChange={update('current')} />
          <PasswordInput id="new-password" label="New password" required value={values.next} onChange={update('next')} />
          <PasswordRequirements password={values.next} />
          <PasswordInput id="confirm-password" label="Confirm new password" required value={values.confirm} onChange={update('confirm')} error={error} />
          <Button type="button" onClick={requestOtp} loading={loading}>{otpRequested ? 'Resend verification code' : 'Send verification code'}</Button>
          {otpMessage && <div className="notice-success" role="status">{otpMessage}</div>}
          {otpRequested && <TextInput id="change-password-otp" label="6-digit verification code" required inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={values.otp} onChange={update('otp')} />}
          <Button type="submit" loading={loading}>Change password</Button>
        </form>
      )}
      <p className="form-switch"><button className="link-button" type="button" onClick={() => navigate('/login')}>Back to sign in</button></p>
    </AuthSplitLayout>
  );
}
