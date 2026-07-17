// Previous name: AdminAccessPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMasterData } from '@/hooks/useMasterData';
import { accessControlService } from '@/services/accessControlService';
import { MasterDataEditor } from '@/shared/components/admin/MasterDataEditor';
import { Button, MultiSelect, TextInput } from '@/shared/components';

export function AccessConsole() {
  const navigate = useNavigate();
  const masterData = useMasterData();
  const [email, setEmail] = useState('');
  const [assignment, setAssignment] = useState({ segments: [], channels: [], brands: [] });
  const [saved, setSaved] = useState(false);
  const activeNames = (type) => masterData[type].filter((item) => item.active).map((item) => item.name);
  const loadUser = () => {
    if (email.trim()) setAssignment(accessControlService.getAssignment(email));
  };
  const saveUser = () => {
    accessControlService.saveAssignment(email, assignment);
    setSaved(true);
  };
  const signOut = () => {
    sessionStorage.clear();
    window.dispatchEvent(new Event('auth-session-change'));
    navigate('/login', { replace: true });
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><span>Administration</span><h1>Access &amp; Master Data</h1><p>Manage onboarding values and user-level data visibility.</p></div>
        <button type="button" onClick={signOut}>Sign out</button>
      </header>

      <div className="admin-grid">
        <MasterDataEditor type="segments" title="Segments" items={masterData.segments} />
        <MasterDataEditor type="channels" title="Channels" items={masterData.channels} />
        <MasterDataEditor type="brands" title="Brands" items={masterData.brands} />
      </div>

      <section className="admin-card user-access-card">
        <div><h2>User assignments</h2><p>Selections control which Segment, Channel, and Brand records the user can view.</p></div>
        <div className="user-lookup">
          <TextInput id="access-email" label="User email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setSaved(false); }} />
          <button type="button" onClick={loadUser}>Load user</button>
        </div>
        <div className="admin-assignment-grid">
          <MultiSelect id="admin-segments" label="Segments" options={activeNames('segments')} value={assignment.segments} onChange={(segments) => setAssignment((current) => ({ ...current, segments }))} />
          <MultiSelect id="admin-channels" label="Channels" options={activeNames('channels')} value={assignment.channels} onChange={(channels) => setAssignment((current) => ({ ...current, channels }))} />
          <MultiSelect id="admin-brands" label="Brands" options={activeNames('brands')} value={assignment.brands} onChange={(brands) => setAssignment((current) => ({ ...current, brands }))} />
        </div>
        <Button type="button" onClick={saveUser} disabled={!email.trim()}>Save user access</Button>
        {saved && <p className="admin-saved">User access saved successfully.</p>}
      </section>
    </main>
  );
}
