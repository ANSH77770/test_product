// Previous name: AdminAccessPage.jsx
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { adminService } from '@/services/adminService';

export function AccessConsole() {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState('');
  const [processingUserId, setProcessingUserId] = useState('');
  const loadPendingUsers = useCallback(async () => {
    setPendingLoading(true);
    setPendingError('');
    try {
      const response = await adminService.getPendingUsers();
      setPendingUsers(Array.isArray(response?.users) ? response.users : []);
    } catch (error) {
      setPendingError(error.message);
    } finally {
      setPendingLoading(false);
    }
  }, []);
  useEffect(() => { loadPendingUsers(); }, [loadPendingUsers]);

  const updateRequest = async (user, action) => {
    setProcessingUserId(user.id);
    setPendingError('');
    try {
      if (action === 'approve') {
        await adminService.approveUser(user.id, user);
      } else {
        await adminService.rejectUser(user.id);
      }
      setPendingUsers((current) => current.filter((item) => item.id !== user.id));
    } catch (error) {
      setPendingError(error.message);
    } finally {
      setProcessingUserId('');
    }
  };
  const signOut = async () => {
    try { await authService.logout(); } catch { /* Clear the local session even if logout fails. */ }
    sessionStorage.clear();
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('auth-session-change'));
    navigate('/login', { replace: true });
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><span>Administration</span><h1>Access Requests</h1><p>Review and manage pending user registrations.</p></div>
        <button type="button" onClick={signOut}>Sign out</button>
      </header>

      <section className="admin-card pending-users-card">
        <div className="pending-users-header">
          <div>
            <span>Approval queue</span>
            <h2>Pending access requests <strong>{pendingUsers.length}</strong></h2>
            <p>Review the user and requested business access before approving.</p>
          </div>
          <button type="button" onClick={loadPendingUsers} disabled={pendingLoading}>Refresh</button>
        </div>

        {pendingError && <div className="notice-error" role="alert">{pendingError}</div>}
        {pendingLoading ? (
          <div className="pending-users-empty">Loading pending requests…</div>
        ) : pendingUsers.length === 0 ? (
          <div className="pending-users-empty"><strong>No pending requests</strong><span>All access requests have been reviewed.</span></div>
        ) : (
          <div className="pending-users-list">
            {pendingUsers.map((user) => (
              <article className="pending-user" key={user.id}>
                <div className="pending-user__identity">
                  <div className="pending-user__avatar">{(user.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()}</div>
                  <div>
                    <h3>{[user.first_name, user.last_name].filter(Boolean).join(' ') || user.username}</h3>
                    <p>{user.email}</p>
                    <small>@{user.username} · {user.status}</small>
                  </div>
                </div>
                <div className="pending-user__requests">
                  <AccessItems label="Segments" items={user.segment} />
                  <AccessItems label="Channels" items={user.channel} />
                  <AccessItems label="Brands" items={user.brand} />
                  <AccessItems label="Permissions" items={user.permissions} emptyText="No permissions requested" />
                </div>
                <div className="pending-user__footer">
                  <small>Requested {user.created_at ? new Date(user.created_at).toLocaleString() : 'recently'}</small>
                  <div>
                    <button type="button" className="reject" disabled={processingUserId === user.id} onClick={() => updateRequest(user, 'reject')}>Reject</button>
                    <button type="button" className="approve" disabled={processingUserId === user.id} onClick={() => updateRequest(user, 'approve')}>{processingUserId === user.id ? 'Processing…' : 'Approve access'}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}

function AccessItems({ label, items = [], emptyText = 'None requested' }) {
  return (
    <div className="pending-user__access-group">
      <strong>{label}</strong>
      <div>{items.length ? items.map((item) => <span key={item}>{item}</span>) : <em>{emptyText}</em>}</div>
    </div>
  );
}
