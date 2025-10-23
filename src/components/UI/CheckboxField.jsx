import React from 'react';

/**
 * Reusable CheckboxField (Bootstrap 4/AdminLTE custom checkbox)
 *
 * Props:
 * - label: string (label text)
 * - name: string (input name/id)
 * - checked: boolean (controlled optional)
 * - onChange: function (controlled optional)
 * - helpText: string
 * - groupClass: wrapper classes, e.g. 'form-group col-md-6'
 * - required: boolean
 * - disabled: boolean
 */
export default function CheckboxField({
  label,
  name,
  checked,
  onChange,
  helpText,
  groupClass = 'form-group col-12',
  required = false,
  disabled = false
}) {
  const id = name;

  const inputProps = {
    id,
    name,
    type: 'checkbox',
    className: 'custom-control-input',
    required,
    disabled,
  };

  if (checked !== undefined) inputProps.checked = checked;
  if (onChange) inputProps.onChange = onChange;

  return (
    <div className={groupClass.includes('form-group') ? groupClass : `form-group ${groupClass}`}>
      <div className="custom-control custom-checkbox">
        <input {...inputProps} />
        <label className="custom-control-label" htmlFor={id}>
          {label}
        </label>
      </div>
      {helpText && <small className="form-text">{helpText}</small>}
    </div>
  );
}
