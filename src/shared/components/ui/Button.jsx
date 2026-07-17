export function Button({ variant = 'primary', loading = false, children, disabled, ...props }) {
  return (
    <button className={`button button--${variant}`} disabled={disabled || loading} {...props}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}
