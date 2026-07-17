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
  const [submitted, setSubmitted] = useState(false);
  const updateText = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const updateList = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
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
    try {
      await authService.registerUser(form);
      accessControlService.saveAssignment(form.email, {
        segments: form.segments,
        channels: form.channels,
        brands: form.brands,
      });
      setSubmitted(true);
    } finally { setLoading(false); }
  };

  return (
    <AuthSplitLayout brandPanel={<BrandPanel />} wide>
      <div className="registration-form">
        <AuthHeading title="Request access" subtitle="Create an account and select all required business access." />
        {submitted ? <div className="notice-success">Your access request has been submitted for approval.</div> : (
          <form onSubmit={submit} noValidate>
            <div className="registration-grid registration-grid--identity">
              <TextInput id="registration-name" label="Name" required value={form.name} onChange={updateText('name')} error={errors.name} />
              <TextInput id="registration-email" label="Email" type="email" required value={form.email} onChange={updateText('email')} error={errors.email} />
            </div>
            <PasswordInput id="registration-password" label="Password" required value={form.password} onChange={updateText('password')} error={errors.password} />
            <PasswordRequirements password={form.password} identity={form} />
            <div className="registration-grid registration-grid--access">
              <MultiSelect id="segments" label="Segments" required options={activeNames('segments')} value={form.segments} onChange={updateList('segments')} error={errors.segments} />
              <MultiSelect id="channels" label="Channels" required options={activeNames('channels')} value={form.channels} onChange={updateList('channels')} error={errors.channels} />
              <MultiSelect id="brands" label="Brands" required options={activeNames('brands')} value={form.brands} onChange={updateList('brands')} error={errors.brands} />
            </div>
            <Button type="submit" loading={loading}>Submit access request</Button>
          </form>
        )}
        <p className="form-switch"><button className="link-button" type="button" onClick={() => navigate('/login')}>Already registered? Sign in</button></p>
      </div>
    </AuthSplitLayout>
  );
}
