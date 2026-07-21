// Previous name: ForgotPasswordPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { AuthHeading, AuthSplitLayout, BrandPanel, Button, TextInput } from '@/shared/components';

export function RecoveryRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await authService.requestPasswordReset(email);
      navigate('/reset-password', { state: { email } });
    } catch (requestError) {
      if (requestError.status >= 500 || requestError.status === 0) setError(requestError.message);
      else navigate('/reset-password', { state: { email } });
    } finally { setLoading(false); }
  };

  return (
    <AuthSplitLayout brandPanel={<BrandPanel />}>
      <AuthHeading title="Forgot password" subtitle="Enter your registered email to receive reset instructions." />
      {error && <div className="notice-error" role="alert">{error}</div>}
      <form onSubmit={submit}>
        <TextInput id="reset-email" label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <Button type="submit" loading={loading}>Send reset code</Button>
      </form>
      <p className="form-switch"><button className="link-button" type="button" onClick={() => navigate('/login')}>← Back to sign in</button></p>
    </AuthSplitLayout>
  );
}
