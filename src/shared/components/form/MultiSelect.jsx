import { useMemo, useRef, useState } from 'react';
import { FormField } from './FormField';

export function MultiSelect({ id, label, options, value, onChange, required = false, error }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const filtered = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );

  const toggle = (option) => {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
    setQuery('');
  };

  const handleBlur = (event) => {
    if (!containerRef.current?.contains(event.relatedTarget)) setIsOpen(false);
  };

  return (
    <FormField id={id} label={label} required={required} error={error}>
      <div
        ref={containerRef}
        className={`multi-select${isOpen ? ' is-open' : ''}`}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
      >
        <input
          id={id}
          className={`multi-select__search${value.length && !isOpen ? ' has-selection' : ''}`}
          value={isOpen ? query : value.join(', ')}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${label.toLowerCase()}…`}
          readOnly={!isOpen}
        />
        <div className="multi-select__options">
          {filtered.map((option) => (
            <button
              key={option}
              type="button"
              className={value.includes(option) ? 'is-selected' : ''}
              aria-pressed={value.includes(option)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => toggle(option)}
            >
              <span aria-hidden="true">{value.includes(option) ? '✓' : ''}</span>
              {option}
            </button>
          ))}
          {filtered.length === 0 && <span>No matches found</span>}
        </div>
      </div>
    </FormField>
  );
}
