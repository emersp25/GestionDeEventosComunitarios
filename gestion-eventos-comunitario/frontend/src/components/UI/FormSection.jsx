import React from 'react';

/**
 * FormSection
 * - Header (title + optional subtitle/right hint)
 * - Divider line
 * - Children content grid goes below
 *
 * Uses global styles from src/style/forms.css:
 *  - .form-section-header, .form-section-title, .form-section-subtitle, .section-divider
 */
export default function FormSection({
  title,
  subtitle,
  rightHint,
  children,
  showDivider = true,
}) {
  return (
    <div className="form-section">
      {(title || subtitle || rightHint) && (
        <div className="form-section-header">
          <div>
            {title && <h6 className="form-section-title">{title}</h6>}
            {subtitle && <p className="form-section-subtitle">{subtitle}</p>}
          </div>
          {rightHint && (
            <div className="text-muted small">{rightHint}</div>
          )}
        </div>
      )}

      {showDivider && <div className="section-divider" />}

      <div className="form-section-content">
        {children}
      </div>
    </div>
  );
}
