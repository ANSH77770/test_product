import { evaluatePassword, PASSWORD_RULES } from '@/lib/passwordPolicy';

export function PasswordRequirements({ password, identity }) {
  const checks = evaluatePassword(password, identity);
  return (
    <ul className="password-rules" aria-label="Password requirements">
      {PASSWORD_RULES.map((rule) => (
        <li key={rule.id} className={checks[rule.id] ? 'is-valid' : ''}>
          <span>{checks[rule.id] ? '✓' : '○'}</span> {rule.label}
        </li>
      ))}
    </ul>
  );
}
