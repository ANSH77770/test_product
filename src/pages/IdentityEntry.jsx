// Previous name: LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_CONFIG } from '@/config/authConfig';
import { authService } from '@/services/authService';
import { AuthHeading, AuthSplitLayout, BrandPanel, LoginForm } from '@/shared/components';

export function IdentityEntry() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const challenge = await authService.requestOtp(credentials);
      navigate('/otp-verification', {
        state: { ...challenge, role: credentials.role },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout brandPanel={<BrandPanel />}>
      <AuthHeading title={AUTH_CONFIG.loginTitle} subtitle={AUTH_CONFIG.loginSubtitle} />
      {error && <div className="notice-error" role="alert">{error}</div>}
      <LoginForm
        roles={AUTH_CONFIG.roles}
        defaultUsername={AUTH_CONFIG.defaultUsername}
        onSubmit={handleLogin}
        onForgotPassword={() => navigate('/forgot-password')}
        onRegister={() => navigate('/register')}
        loading={loading}
      />
      <p className="support-text">{AUTH_CONFIG.supportText}</p>
    </AuthSplitLayout>
  );
}
