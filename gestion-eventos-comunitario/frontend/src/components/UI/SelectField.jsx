import React from 'react';

/**
 * Reusable SelectField
 * - Consistent label, required asterisk, help text
 * - Uses Bootstrap 4/AdminLTE "custom-select" + global styles in src/style/forms.css
 *
 * Props:
 * - label: string
 * - name: string
 * - options: Array<{ value: string|number, label: string }>
 * - placeholder: string (first disabled option)
 * - required: boolean
 * - value, onChange: controlled optional
 * - helpText: string
 * - groupClass: wrapper classes, e.g. 'form-group col-md-6'
 */
export default function SelectField({
  label,
  name,
  options = [],
  placeholder,
  required = false,
  value,
  onChange,
  helpText,
  groupClass = 'form-group col-12'
}) {
  const selectProps = {
    id: name,
    name,
    required,
    className: 'custom-select custom-select-sm'
  };

  if (value !== undefined) selectProps.value = value;
  if (onChange) selectProps.onChange = onChange;

  return (
    <div className={groupClass.includes('form-group') ? groupClass : `form-group ${groupClass}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <select {...selectProps}>
        {placeholder ? <option value="" disabled>{placeholder}</option> : null}
        {options.map(opt => (
          <option key={String(opt.value)} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {helpText && <small className="form-text">{helpText}</small>}
    </div>
  );
}
