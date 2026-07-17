import { FormField } from './FormField';

export function SelectInput({ label, id, options, ...selectProps }) {
  return (
    <FormField label={label} id={id}>
      <select id={id} className="control" {...selectProps}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </FormField>
  );
}
