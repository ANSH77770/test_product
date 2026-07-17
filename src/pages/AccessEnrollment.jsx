// Previous name: RegistrationPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_CONFIG } from '@/config/authConfig';
import { useMasterData } from '@/hooks/useMasterData';
import { validatePassword } from '@/lib/passwordPolicy';
import { authService } from '@/services/authService';
import { accessControlService } from '@/services/accessControlService';
import { AuthHeading, AuthSplitLayout, BrandPanel, Button, MultiSelect, PasswordInput, PasswordRequirements, TextInput } from '@/shared/components';

const EMPTY_FORM = { name: '', email: '', password: '', segments: [], channels: [], brands: [] };

export function AccessEnrollment() {
  const navigate = useNavigate();
  const masterData = useMasterData();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [openAccessSelect, setOpenAccessSelect] = useState(null);
  const updateText = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const updateList = (field) => (value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'segments' ? { channels: [], brands: [] } : {}),
      ...(field === 'channels' ? { brands: [] } : {}),
    }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setOpenAccessSelect(null);
  };
  const activeNames = (type) => masterData[type].filter((item) => item.active).map((item) => item.name);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    const passwordError = validatePassword(form.password, form);
    if (passwordError) nextErrors.password = passwordError;
    if (!form.segments.length) nextErrors.segments = 'Select at least one segment.';
    if (!form.channels.length) nextErrors.channels = 'Select at least one channel.';
    if (!form.brands.length) nextErrors.brands = 'Select at least one brand.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    setApiError('');
    try {
      await authService.registerUser(form);
      accessControlService.saveAssignment(form.email, {
        segments: form.segments,
        channels: form.channels,
        brands: form.brands,
      });
      navigate('/otp-verification', {
        state: { destination: form.email, purpose: 'REGISTRATION' },
      });
    } catch (requestError) {
      setApiError(requestError.message);
    } finally { setLoading(false); }
  };

  return (
    <AuthSplitLayout brandPanel={<BrandPanel />} wide>
      <div className="registration-form">
        <div className="registration-form__eyebrow">New account</div>
        <AuthHeading title="Request access" subtitle="Tell us who you are and choose the business areas you need." />
        {apiError && <div className="notice-error" role="alert">{apiError}</div>}
        <form onSubmit={submit} noValidate>
          <section className="registration-section" aria-labelledby="identity-section-title">
            <div className="registration-section__heading">
              <span>1</span>
              <div><h3 id="identity-section-title">Account details</h3><p>Use your work email address.</p></div>
            </div>
            <div className="registration-grid registration-grid--identity">
              <TextInput id="registration-name" label="Name" required value={form.name} onChange={updateText('name')} error={errors.name} />
              <TextInput id="registration-email" label="Email" type="email" required value={form.email} onChange={updateText('email')} error={errors.email} />
            </div>
            <PasswordInput id="registration-password" label="Password" required value={form.password} onChange={updateText('password')} error={errors.password} />
            <PasswordRequirements password={form.password} identity={form} />
          </section>
          <section className="registration-section" aria-labelledby="access-section-title">
            <div className="registration-section__heading">
              <span>2</span>
              <div><h3 id="access-section-title">Business access</h3><p>You can select more than one option.</p></div>
            </div>
            <div className="access-flow" aria-label="Business access selection steps">
              <div className="access-flow__step">
                <MultiSelect id="segments" label="Segments" required options={activeNames('segments')} value={form.segments} onChange={updateList('segments')} error={errors.segments} open={openAccessSelect === 'segments'} onOpenChange={(open) => setOpenAccessSelect(open ? 'segments' : null)} />
              </div>
              <div className="access-flow__step">
                <MultiSelect id="channels" label="Channels" required options={activeNames('channels')} value={form.channels} onChange={updateList('channels')} error={errors.channels} disabled={!form.segments.length} disabledHint="Select a segment first" open={openAccessSelect === 'channels'} onOpenChange={(open) => setOpenAccessSelect(open ? 'channels' : null)} />
              </div>
              <div className="access-flow__step">
                <MultiSelect id="brands" label="Brands" required options={activeNames('brands')} value={form.brands} onChange={updateList('brands')} error={errors.brands} disabled={!form.channels.length} disabledHint="Select a channel first" open={openAccessSelect === 'brands'} onOpenChange={(open) => setOpenAccessSelect(open ? 'brands' : null)} />
              </div>
            </div>
          </section>
          <Button type="submit" loading={loading}>Submit access request</Button>
        </form>
        <p className="form-switch"><button className="link-button" type="button" onClick={() => navigate('/login')}>Already registered? Sign in</button></p>
      </div>
    </AuthSplitLayout>
  );
}
