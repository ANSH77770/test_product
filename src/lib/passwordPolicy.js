import { AUTH_CONFIG } from '@/config/authConfig';

export const PASSWORD_RULES = [
  { id: 'length', label: `At least ${AUTH_CONFIG.passwordPolicy.minimumLength} characters` },
  { id: 'uppercase', label: 'At least one uppercase letter' },
  { id: 'lowercase', label: 'At least one lowercase letter' },
  { id: 'number', label: 'At least one number' },
  { id: 'special', label: 'At least one special character' },
  { id: 'identity', label: 'Must not contain your name or email ID' },
];

export function evaluatePassword(password, { name = '', email = '' } = {}) {
  const normalizedPassword = password.toLowerCase();
  const identityParts = [
    ...name.toLowerCase().split(/\s+/),
    email.toLowerCase(),
    email.toLowerCase().split('@')[0],
  ].filter((part) => part.length >= 3);

  return {
    length: password.length >= AUTH_CONFIG.passwordPolicy.minimumLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    identity: !identityParts.some((part) => normalizedPassword.includes(part)),
  };
}

export function validatePassword(password, identity) {
  const checks = evaluatePassword(password, identity);
  return Object.values(checks).every(Boolean) ? '' : 'Password does not meet all security requirements.';
}
