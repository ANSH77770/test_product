// Previous name: ChangePasswordPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_CONFIG } from '@/config/authConfig';
import { validatePassword } from '@/lib/passwordPolicy';
import { authService } from '@/services/authService';
import { AuthHeading, AuthSplitLayout, BrandPanel, Button, PasswordInput, PasswordRequirements } from '@/shared/components';

export function CredentialUpdate() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const policyError = validatePassword(values.next);
    if (policyError) return setError(policyError);
    if (values.next !== values.confirm) return setError('New password and confirmation do not match.');
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
          <Button type="submit" loading={loading}>Change password</Button>
        </form>
      )}
      <p className="form-switch"><button className="link-button" type="button" onClick={() => navigate('/login')}>Back to sign in</button></p>
    </AuthSplitLayout>
  );
}
