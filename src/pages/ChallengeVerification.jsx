// Previous name: OtpVerificationPage.jsx
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { AuthHeading, AuthSplitLayout, BrandPanel, Button, OtpForm } from '@/shared/components';

export function ChallengeVerification() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  if (!state?.destination) return <Navigate to="/login" replace />;

  const verify = async (code) => {
    setLoading(true);
    setError('');
    try {
      if (state.purpose === 'REGISTRATION') {
        await authService.verifyRegistrationOtp(state.destination, code);
        setVerified(true);
        return;
      }
      const result = await authService.verifyOtp({
        email: state.destination,
        code,
        rememberMe: state.rememberMe,
      });
      if (result.authenticated) {
        const currentUser = await authService.getCurrentUser();
        const backendRole = String(currentUser.role || '').trim().toUpperCase();
        const isBackendAdministrator = ['ADMIN', 'FINANCE ADMINISTRATOR'].includes(backendRole);
        const authenticatedRole = isBackendAdministrator
          ? 'Finance Administrator'
          : state.role === 'Finance Administrator' ? 'Finance Planner' : state.role;
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('role', authenticatedRole);
        sessionStorage.setItem('userEmail', currentUser.email || state.destination);
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.dispatchEvent(new Event('auth-session-change'));
        navigate('/dashboard', { replace: true });
      }
      setVerified(result.authenticated);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout brandPanel={<BrandPanel />}>
      {verified ? (
        <div className="success-state" role="status">
          <div className="success-icon">✓</div>
          <AuthHeading title="Authentication successful" subtitle="Your identity has been verified." />
          {state.purpose === 'REGISTRATION' && (
            <Button type="button" onClick={() => navigate('/login')}>Continue to sign in</Button>
          )}
          {state.role === 'Finance Administrator' && (
            <Button type="button" onClick={() => navigate('/admin/access')}>Open administration</Button>
          )}
        </div>
      ) : (
        <>
          <AuthHeading
            title="Verify your identity"
            subtitle={`Enter the 6-digit code sent to ${state.destination}.`}
          />
          {error && <div className="notice-error" role="alert">{error}</div>}
          <OtpForm
            onSubmit={verify}
            onResend={() => state.purpose === 'REGISTRATION'
              ? authService.resendRegistrationOtp(state.destination)
              : authService.resendOtp(state.destination)}
            onBack={() => navigate(state.purpose === 'REGISTRATION' ? '/register' : '/login', { state: { username: state.destination } })}
            loading={loading}
          />
        </>
      )}
    </AuthSplitLayout>
  );
}
