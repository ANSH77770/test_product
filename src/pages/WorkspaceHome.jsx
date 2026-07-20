// Previous name: DashboardPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_CONFIG } from '@/config/authConfig';
import { authService } from '@/services/authService';
import { adminService } from '@/services/adminService';
import { isAdminRole } from '@/lib/roles';

export function WorkspaceHome() {
  const navigate = useNavigate();
  const currentUser = (() => {
    try { return JSON.parse(sessionStorage.getItem('currentUser') || '{}'); }
    catch { return {}; }
  })();
  const role = sessionStorage.getItem('role') || 'User';
  const email = sessionStorage.getItem('userEmail') || '';
  const isAdministrator = isAdminRole(currentUser.role);
  const [pendingCount, setPendingCount] = useState(null);
  const [pendingError, setPendingError] = useState('');

  useEffect(() => {
    if (!isAdministrator) return undefined;
    let active = true;
    adminService.getPendingUsers()
      .then((response) => {
        if (active) setPendingCount(Array.isArray(response?.users) ? response.users.length : 0);
      })
      .catch((error) => {
        if (active) setPendingError(error.message);
      });
    return () => { active = false; };
  }, [isAdministrator]);

  const signOut = async () => {
    try { await authService.logout(); } catch { /* Clear the local session even if logout fails. */ }
    sessionStorage.clear();
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('auth-session-change'));
    navigate('/login', { replace: true });
  };

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <div className="workspace-brand">
          <span>{AUTH_CONFIG.companyInitial}</span>
          <div><strong>{AUTH_CONFIG.companyName}</strong><small>{AUTH_CONFIG.productSubtitle}</small></div>
        </div>
        <div className="workspace-user">
          <div><strong>{role}</strong><small>{email}</small></div>
          <button type="button" onClick={signOut}>Sign out</button>
        </div>
      </header>

      <section className="workspace-content">
        <div className="workspace-welcome">
          <span>Authenticated workspace</span>
          <h1>Welcome to your dashboard</h1>
          <p>Your identity has been verified successfully. Select an available action to continue.</p>
        </div>
        <div className="workspace-cards">
          <article><div>01</div><h2>Planning workspace</h2><p>Open the budgeting and planning workspace assigned to your role.</p><button type="button">Open workspace</button></article>
          <article><div>02</div><h2>Security settings</h2><p>Review your account security or update your password.</p><button type="button" onClick={() => navigate('/change-password')}>Change password</button></article>
          {isAdministrator && (
            <article className="workspace-admin-card">
              <div>03</div>
              <div className="pending-request-summary">
                <span>{pendingCount === null ? '…' : pendingCount}</span>
                <small>Pending access {pendingCount === 1 ? 'request' : 'requests'}</small>
              </div>
              <h2>Administration</h2>
              <p>{pendingError || 'Review pending registrations and manage user access assignments.'}</p>
              <button type="button" onClick={() => navigate('/admin/access')}>Review requests</button>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
