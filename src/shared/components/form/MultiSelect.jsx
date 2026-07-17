import { useMemo, useRef, useState } from 'react';
import { FormField } from './FormField';

export function MultiSelect({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  disabledHint = '',
  open: controlledOpen,
  onOpenChange,
}) {
  const [query, setQuery] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  const containerRef = useRef(null);
  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = (nextOpen) => {
    if (disabled) return;
    if (onOpenChange) onOpenChange(nextOpen);
    else setInternalOpen(nextOpen);
    if (!nextOpen) setQuery('');
  };
  const filtered = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(query.trim().toLowerCase())),
    [options, query],
  );

  const toggle = (option) => {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
    setQuery('');
  };

  const remove = (option, event) => {
    event.preventDefault();
    event.stopPropagation();
    onChange(value.filter((item) => item !== option));
  };

  const handleBlur = (event) => {
    if (!containerRef.current?.contains(event.relatedTarget)) {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <FormField id={id} label={label} required={required} error={error}>
      <div
        ref={containerRef}
        className={`multi-select${isOpen ? ' is-open' : ''}${value.length ? ' has-value' : ''}${error ? ' has-error' : ''}${disabled ? ' is-disabled' : ''}`}
        onBlur={handleBlur}
      >
        <div className="multi-select__control" onClick={() => setIsOpen(true)} aria-disabled={disabled}>
          <div className="multi-select__values">
            {value.map((option) => (
              <span className="multi-select__chip" key={option}>
                <span>{option}</span>
                <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={(event) => remove(option, event)} aria-label={`Remove ${option}`}>×</button>
              </span>
            ))}
            <input
              id={id}
              className="multi-select__search"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={disabled ? disabledHint : value.length ? (isOpen ? 'Search more…' : '') : `Select ${label.toLowerCase()}…`}
              aria-expanded={isOpen}
              aria-controls={`${id}-options`}
              autoComplete="off"
              disabled={disabled}
            />
          </div>
          <span className="multi-select__chevron" aria-hidden="true">⌄</span>
        </div>

        <div className="multi-select__options" id={`${id}-options`} role="listbox" aria-multiselectable="true">
          <div className="multi-select__options-header">
            <span>{value.length ? `${value.length} selected` : 'Choose options'}</span>
            {value.length > 0 && <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onChange([])}>Clear</button>}
          </div>
          {filtered.map((option) => {
            const selected = value.includes(option);
            return (
              <button
                key={option}
                type="button"
                role="option"
                className={selected ? 'is-selected' : ''}
                aria-selected={selected}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => toggle(option)}
              >
                <span className="multi-select__check" aria-hidden="true">{selected ? '✓' : ''}</span>
                <span>{option}</span>
              </button>
            );
          })}
          {filtered.length === 0 && <div className="multi-select__empty">No matching options</div>}
        </div>
      </div>
    </FormField>
  );
}
