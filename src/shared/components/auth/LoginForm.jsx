import { useState } from 'react';
import { TextInput } from '@/shared/components/form/TextInput';
import { PasswordInput } from '@/shared/components/form/PasswordInput';
import { SelectInput } from '@/shared/components/form/SelectInput';
import { Button } from '@/shared/components/ui/Button';

export function LoginForm({ roles, defaultUsername = '', onSubmit, onForgotPassword, onRegister, loading = false }) {
  const [values, setValues] = useState({
    username: defaultUsername,
    password: '',
    role: roles[0] ?? '',
    rememberMe: true,
  });
  const [errors, setErrors] = useState({});

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.username.trim()) nextErrors.username = 'Username or email is required.';
    if (values.password.length < 6) nextErrors.password = 'Password must contain at least 6 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextInput
        id="username"
        label="Username / Email"
        required
        autoComplete="username"
        value={values.username}
        onChange={update('username')}
        error={errors.username}
      />
      <PasswordInput
        id="password"
        required
        autoComplete="current-password"
        value={values.password}
        onChange={update('password')}
        error={errors.password}
      />
      <SelectInput id="role" label="Demo role" options={roles} value={values.role} onChange={update('role')} />

      <div className="form-options">
        <label className="checkbox-label">
          <input type="checkbox" checked={values.rememberMe} onChange={update('rememberMe')} />
          Remember me
        </label>
        <button type="button" className="link-button" onClick={onForgotPassword}>Forgot password?</button>
      </div>

      <Button type="submit" loading={loading} className="submit-access-btn">Login</Button>
      <Button type="button" variant="secondary" disabled>
        Login with SSO <span>(coming soon)</span>
      </Button>
      <p className="form-switch">
        New user?{' '}
        <button type="button" className="link-button request-access-toggle" onClick={onRegister}>
          <span>Request access</span>
          <span className="toggle-icon"></span>
        </button>
      </p>
    </form>
  );
}
