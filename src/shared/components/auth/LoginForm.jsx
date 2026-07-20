import { useState } from 'react';
import { TextInput } from '@/shared/components/form/TextInput';
import { PasswordInput } from '@/shared/components/form/PasswordInput';
import { Button } from '@/shared/components/ui/Button';

export function LoginForm({ defaultUsername = '', onSubmit, onForgotPassword, onRegister, loading = false }) {
  const [values, setValues] = useState({
    username: defaultUsername,
    password: '',
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
      <div className="form-options">
        <button type="button" className="link-button" onClick={onForgotPassword}>Forgot password?</button>
      </div>

      <Button type="submit" loading={loading} className="submit-access-btn">Login</Button>
      <p className="form-switch login-signup-row">
        New user?{' '}
        <button type="button" className="link-button auth-inline-link" onClick={onRegister}>
          <span>Sign up</span>
        </button>
      </p>
    </form>
  );
}
