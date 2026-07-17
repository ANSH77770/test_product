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

  if (!state?.challengeId) return <Navigate to="/login" replace />;

  const verify = async (code) => {
    setLoading(true);
    try {
      const result = await authService.verifyOtp({ challengeId: state.challengeId, code });
      if (result.authenticated) {
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('role', state.role);
        sessionStorage.setItem('userEmail', state.destination);
        window.dispatchEvent(new Event('auth-session-change'));
        navigate('/dashboard', { replace: true });
      }
      setVerified(result.authenticated);
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
          <OtpForm
            onSubmit={verify}
            onResend={() => authService.resendOtp(state.challengeId)}
            onBack={() => navigate('/login', { state: { username: state.destination } })}
            loading={loading}
          />
          <p className="support-text">Demo mode: any 6-digit OTP is accepted.</p>
        </>
      )}
    </AuthSplitLayout>
  );
}
