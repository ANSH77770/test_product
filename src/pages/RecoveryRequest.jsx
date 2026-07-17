// Previous name: ForgotPasswordPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { AuthHeading, AuthSplitLayout, BrandPanel, Button, TextInput } from '@/shared/components';

export function RecoveryRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
    } finally { setLoading(false); }
  };

  return (
    <AuthSplitLayout brandPanel={<BrandPanel />}>
      <AuthHeading title="Forgot password" subtitle="Enter your registered email to receive reset instructions." />
      {sent ? (
        <div className="notice-success">If an account exists for {email}, reset instructions have been sent.</div>
      ) : (
        <form onSubmit={submit}>
          <TextInput id="reset-email" label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <Button type="submit" loading={loading}>Send reset instructions</Button>
        </form>
      )}
      <p className="form-switch"><button className="link-button" type="button" onClick={() => navigate('/login')}>← Back to sign in</button></p>
    </AuthSplitLayout>
  );
}
