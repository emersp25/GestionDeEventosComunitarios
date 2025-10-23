import React, { useState, useMemo } from 'react';

/**
 * Reusable TextareaField
 * - Consistent label, required asterisk, help text
 * - Optional character counter (charLimit)
 * - Uses Bootstrap/AdminLTE classes + global styles from src/style/forms.css
 *
 * Props:
 * - label: string
 * - name: string
 * - placeholder: string
 * - required: boolean
 * - value, onChange: controlled optional
 * - helpText: string
 * - groupClass: wrapper classes, e.g. 'form-group col-12'
 * - rows: number (default 4)
 * - charLimit: number (if provided, shows counter and enforces maxLength)
 */
export default function TextareaField({
  label,
  name,
  placeholder,
  required = false,
  value,
  onChange,
  helpText,
  groupClass = 'form-group col-12',
  rows = 4,
  charLimit
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState('');

  const currentValue = isControlled ? String(value ?? '') : internal;

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.value);
    if (onChange) onChange(e);
  };

  const remaining = useMemo(() => {
    if (!charLimit) return null;
    return Math.max(0, charLimit - (currentValue?.length || 0));
  }, [charLimit, currentValue]);

  const textareaProps = {
    id: name,
    name,
    className: 'form-control form-control-sm',
    placeholder,
    required,
    rows,
    onChange: handleChange
  };
  if (charLimit) textareaProps.maxLength = charLimit;
  if (isControlled) textareaProps.value = value;
  else textareaProps.value = internal;

  return (
    <div className={groupClass.includes('form-group') ? groupClass : `form-group ${groupClass}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="position-relative">
        <textarea {...textareaProps} />
      </div>
      {(helpText || charLimit) ? (
        <div className={`d-flex ${helpText && charLimit ? 'justify-content-between' : charLimit ? 'justify-content-end' : ''} mt-1`}>
          {helpText ? <small className="form-text mb-0">{helpText}</small> : null}
          {charLimit ? (
            <span className="char-counter">Máximo {charLimit} caracteres ({(currentValue?.length || 0)}/{charLimit})</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
