// Previous name: DashboardPage.jsx
import { useNavigate } from 'react-router-dom';
import { AUTH_CONFIG } from '@/config/authConfig';

export function WorkspaceHome() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem('role') || 'User';
  const email = sessionStorage.getItem('userEmail') || '';
  const isAdministrator = role === 'Finance Administrator';

  const signOut = () => {
    sessionStorage.clear();
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
          {isAdministrator && <article><div>03</div><h2>Administration</h2><p>Manage master data and user access assignments.</p><button type="button" onClick={() => navigate('/admin/access')}>Open administration</button></article>}
        </div>
      </section>
    </main>
  );
}
