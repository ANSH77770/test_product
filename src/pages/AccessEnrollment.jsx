// Previous name: RegistrationPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validatePassword } from '@/lib/passwordPolicy';
import { authService } from '@/services/authService';
import { referenceDataService } from '@/services/referenceDataService';
import { AuthHeading, AuthSplitLayout, BrandPanel, Button, MultiSelect, PasswordInput, PasswordRequirements, TextInput } from '@/shared/components';

const EMPTY_FORM = { firstName: '', lastName: '', username: '', email: '', role: '', password: '', segments: [], channels: [], brands: [] };
const EMPTY_OPTIONS = { segments: [], channels: [], brands: [], roles: [] };

export function AccessEnrollment() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [openAccessSelect, setOpenAccessSelect] = useState(null);
  const [exiting, setExiting] = useState(false);
  const [accessOptions, setAccessOptions] = useState(EMPTY_OPTIONS);
  const [referenceLoading, setReferenceLoading] = useState(true);
  const [referenceError, setReferenceError] = useState('');

  useEffect(() => {
    let active = true;
    referenceDataService.getAll()
      .then((data) => { if (active) setAccessOptions(data); })
      .catch((error) => { if (active) setReferenceError(error.message); })
      .finally(() => { if (active) setReferenceLoading(false); });
    return () => { active = false; };
  }, []);

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
  const updateRole = (roles) => {
    setForm((current) => ({ ...current, role: roles.at(-1) || '' }));
    setErrors((current) => ({ ...current, role: undefined }));
  };
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.firstName.trim() || form.firstName.trim().length > 50) nextErrors.firstName = 'Enter a first name of up to 50 characters.';
    if (!form.lastName.trim() || form.lastName.trim().length > 50) nextErrors.lastName = 'Enter a last name of up to 50 characters.';
    if (form.username.trim().length < 3 || form.username.trim().length > 50) nextErrors.username = 'Username must contain 3–50 characters.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (!form.role) nextErrors.role = 'Select a role.';
    const identity = { name: `${form.firstName} ${form.lastName}`, email: form.email };
    const passwordError = validatePassword(form.password, identity);
    if (passwordError) nextErrors.password = passwordError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    setApiError('');
    try {
      await authService.registerUser(form);
      navigate('/otp-verification', {
        state: { destination: form.email, purpose: 'REGISTRATION' },
      });
    } catch (requestError) {
      if (requestError.status === 409) {
        const detail = requestError.message.toLowerCase();
        setErrors((current) => ({
          ...current,
          ...(detail.includes('email') ? { email: 'This email is already registered.' } : {}),
          ...(detail.includes('username') ? { username: 'This username is already registered.' } : {}),
        }));
        if (!detail.includes('email') && !detail.includes('username')) setApiError(requestError.message);
      } else if (requestError.status === 400 || requestError.status === 422) {
        const validationItems = Array.isArray(requestError.data?.detail) ? requestError.data.detail : [];
        const fieldErrors = validationItems.reduce((result, item) => {
          const apiField = Array.isArray(item?.loc) ? item.loc.at(-1) : '';
          const formField = {
            first_name: 'firstName',
            last_name: 'lastName',
            username: 'username',
            email: 'email',
            password: 'password',
            role: 'role',
          }[apiField];
          return formField ? { ...result, [formField]: item.msg || 'Invalid value.' } : result;
        }, {});
        if (Object.keys(fieldErrors).length) setErrors((current) => ({ ...current, ...fieldErrors }));
        else setApiError(requestError.message);
      } else {
        setApiError(requestError.message);
      }
    } finally { setLoading(false); }
  };

  const handleLoginTransition = () => {
    setExiting(true);
    setTimeout(() => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          navigate('/login');
        });
      } else {
        navigate('/login');
      }
    }, 280);
  };

  return (
    <AuthSplitLayout brandPanel={<BrandPanel />} wide exiting={exiting}>
      <div className="registration-form">
        <div className="registration-form__eyebrow">New account</div>
        <AuthHeading title="Request access" subtitle="Tell us who you are and choose the business areas you need." />
        {apiError && <div className="notice-error" role="alert">{apiError}</div>}
        {referenceError && <div className="notice-error" role="alert">Unable to load access options. {referenceError}</div>}
        <form onSubmit={submit} noValidate>
          <section className="registration-section" aria-labelledby="identity-section-title">
            <div className="registration-section__heading">
              <span>1</span>
              <div><h3 id="identity-section-title">Account details</h3><p>Use your work email address.</p></div>
            </div>
            <div className="registration-grid registration-grid--identity">
              <TextInput id="registration-first-name" label="First name" required maxLength={50} value={form.firstName} onChange={updateText('firstName')} error={errors.firstName} />
              <TextInput id="registration-last-name" label="Last name" required maxLength={50} value={form.lastName} onChange={updateText('lastName')} error={errors.lastName} />
            </div>
            <div className="registration-grid registration-grid--identity">
              <TextInput id="registration-username" label="Username" required minLength={3} maxLength={50} value={form.username} onChange={updateText('username')} error={errors.username} />
              <TextInput id="registration-email" label="Email" type="email" required value={form.email} onChange={updateText('email')} error={errors.email} />
            </div>
            <MultiSelect id="registration-role" label="Role" required options={accessOptions.roles} value={form.role ? [form.role] : []} onChange={updateRole} error={errors.role} disabled={referenceLoading || Boolean(referenceError)} disabledHint={referenceLoading ? 'Loading roles…' : 'Roles unavailable'} open={openAccessSelect === 'role'} onOpenChange={(open) => setOpenAccessSelect(open ? 'role' : null)} />
            <PasswordInput id="registration-password" label="Password" required value={form.password} onChange={updateText('password')} error={errors.password} />
            <PasswordRequirements password={form.password} identity={{ name: `${form.firstName} ${form.lastName}`, email: form.email }} />
          </section>
          <section className="registration-section" aria-labelledby="access-section-title">
            <div className="registration-section__heading">
              <span>2</span>
              <div><h3 id="access-section-title">Business access</h3><p>You can select more than one option.</p></div>
            </div>
            <div className="access-flow" aria-label="Business access selection steps">
              <div className="access-flow__step">
                <MultiSelect id="segments" label="Segments" options={accessOptions.segments} value={form.segments} onChange={updateList('segments')} error={errors.segments} disabled={referenceLoading || Boolean(referenceError)} disabledHint={referenceLoading ? 'Loading segments…' : 'Segments unavailable'} open={openAccessSelect === 'segments'} onOpenChange={(open) => setOpenAccessSelect(open ? 'segments' : null)} />
              </div>
              <div className="access-flow__step">
                <MultiSelect id="channels" label="Channels" options={accessOptions.channels} value={form.channels} onChange={updateList('channels')} error={errors.channels} disabled={!form.segments.length} disabledHint="Select a segment first" open={openAccessSelect === 'channels'} onOpenChange={(open) => setOpenAccessSelect(open ? 'channels' : null)} />
              </div>
              <div className="access-flow__step">
                <MultiSelect id="brands" label="Brands" options={accessOptions.brands} value={form.brands} onChange={updateList('brands')} error={errors.brands} disabled={!form.channels.length} disabledHint="Select a channel first" open={openAccessSelect === 'brands'} onOpenChange={(open) => setOpenAccessSelect(open ? 'brands' : null)} />
              </div>
            </div>
          </section>
          <Button type="submit" loading={loading} className="submit-access-btn">Submit access request</Button>
        </form>
        <p className="form-switch">
          Already registered?{' '}
          <button className="link-button auth-inline-link" type="button" onClick={handleLoginTransition}>
            <span>Log in</span>
          </button>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
