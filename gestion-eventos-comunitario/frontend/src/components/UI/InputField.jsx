import React from 'react';

/**
 * Reusable InputField
 * - Consistent label, required asterisk, help text
 * - Uses Bootstrap/AdminLTE classes + global styles from src/style/forms.css
 *
 * Props:
 * - label: string (label text)
 * - name: string (input name/id)
 * - type: string ('text' | 'email' | 'tel' | 'date' | 'time' | 'number' | ...)
 * - placeholder: string
 * - required: boolean
 * - value: any (controlled optional)
 * - onChange: function (controlled optional)
 * - helpText: string (small hint under the field)
 * - groupClass: string (wrapper classes, e.g. 'form-group col-md-6')
 * - autoComplete, min, max, step, pattern: native input attributes
 */
export default function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange,
  helpText,
  groupClass = 'form-group col-12',
  autoComplete = 'off',
  min,
  max,
  step,
  minLength,
  maxLength,
  pattern
}) {
  const inputProps = {
    id: name,
    name,
    type,
    placeholder,
    required,
    autoComplete,
    min,
    max,
    step,
    minLength,
    maxLength,
    pattern,
    className: 'form-control form-control-sm'
  };

  if (value !== undefined) inputProps.value = value;
  if (onChange) inputProps.onChange = onChange;

  return (
    <div className={groupClass.includes('form-group') ? groupClass : `form-group ${groupClass}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <input {...inputProps} />
      {helpText && <small className="form-text">{helpText}</small>}
    </div>
  );
}
