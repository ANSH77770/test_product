export function FormField({ label, error, required, id, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}
