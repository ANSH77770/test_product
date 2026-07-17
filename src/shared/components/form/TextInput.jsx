import { FormField } from './FormField';

export function TextInput({ label, error, required = false, id, ...inputProps }) {
  return (
    <FormField label={label} error={error} required={required} id={id}>
      <input id={id} className="control" aria-invalid={Boolean(error)} {...inputProps} />
    </FormField>
  );
}
