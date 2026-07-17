export function Button({ variant = 'primary', loading = false, className = '', children, disabled, ...props }) {
  return (
    <button className={`button button--${variant} ${className}`.trim()} disabled={disabled || loading} {...props}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}
