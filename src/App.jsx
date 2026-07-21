import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AUTH_CONFIG, BRAND_CSS_VARIABLES } from '@/config/authConfig';
import { useIdleSession } from '@/hooks/useIdleSession';
import { IdentityEntry } from '@/pages/IdentityEntry';
import { ChallengeVerification } from '@/pages/ChallengeVerification';
import { RecoveryRequest } from '@/pages/RecoveryRequest';
import { CredentialUpdate } from '@/pages/CredentialUpdate';
import { PasswordReset } from '@/pages/PasswordReset';
import { AccessEnrollment } from '@/pages/AccessEnrollment';
import { AccessConsole } from '@/pages/AccessConsole';
import { WorkspaceHome } from '@/pages/WorkspaceHome';

export function App() {
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(() => sessionStorage.getItem('authenticated') === 'true');
  const [sessionRole, setSessionRole] = useState(() => sessionStorage.getItem('role') || '');
  useEffect(() => {
    document.title = AUTH_CONFIG.pageTitle;
  }, []);
  useEffect(() => {
    const syncSession = () => {
      setSessionActive(sessionStorage.getItem('authenticated') === 'true');
      setSessionRole(sessionStorage.getItem('role') || '');
    };
    window.addEventListener('auth-session-change', syncSession);
    return () => window.removeEventListener('auth-session-change', syncSession);
  }, []);
  const expireSession = useCallback(() => {
    sessionStorage.removeItem('authenticated');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userEmail');
    setSessionActive(false);
    navigate('/login', { replace: true, state: { sessionExpired: true } });
  }, [navigate]);
  useEffect(() => {
    window.addEventListener('auth-session-expired', expireSession);
    return () => window.removeEventListener('auth-session-expired', expireSession);
  }, [expireSession]);
  useIdleSession({ enabled: sessionActive, timeoutMinutes: AUTH_CONFIG.sessionTimeoutMinutes, onTimeout: expireSession });

  return (
    <div style={BRAND_CSS_VARIABLES}>
      <Routes>
        <Route path="/login" element={<IdentityEntry />} />
        <Route path="/otp-verification" element={<ChallengeVerification />} />
        <Route path="/forgot-password" element={<RecoveryRequest />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/change-password" element={sessionActive ? <CredentialUpdate /> : <Navigate to="/login" replace />} />
        <Route path="/register" element={<AccessEnrollment />} />
        <Route path="/dashboard" element={sessionActive ? <WorkspaceHome /> : <Navigate to="/login" replace />} />
        <Route
          path="/admin/access"
          element={sessionActive && sessionRole === 'Finance Administrator' ? <AccessConsole /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
