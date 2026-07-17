import { useState } from 'react';
import { FormField } from './FormField';

export function PasswordInput({ label = 'Password', error, required = false, id, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField label={label} error={error} required={required} id={id}>
      <div className="password-control">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          {...inputProps}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {visible ? (
              <>
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5 9 5a16 16 0 0 1-2.1 2.6M6.6 6.6C4.3 8.1 3 10 3 10s3.5 5 9 5c1 0 2-.2 2.8-.5" />
              </>
            ) : (
              <>
                <path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Z" />
                <circle cx="12" cy="12" r="2.5" />
              </>
            )}
          </svg>
        </button>
      </div>
    </FormField>
  );
}
