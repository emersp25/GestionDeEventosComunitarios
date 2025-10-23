import React from 'react';

/**
 * Pagination (client-side)
 * Props:
 * - total: number (total items)
 * - page: number (1-based)
 * - pageSize: number
 * - onPageChange: (n: number) => void
 * - onPageSizeChange: (n: number) => void
 * - pageSizeOptions?: number[] (default [5,10,20,50])
 * Renders:
 * - "Mostrando X–Y de Z"
 * - Selector de tamaño de página
 * - Controles de paginación con números y anterior/siguiente
 */
export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50]
}) {
  const totalPages = Math.max(1, Math.ceil((Number(total) || 0) / (Number(pageSize) || 10)));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const size = Math.max(1, Number(pageSize) || 10);

  const start = total === 0 ? 0 : (current - 1) * size + 1;
  const end = Math.min(total, current * size);

  const changePage = (p) => {
    const n = Math.min(Math.max(1, p), totalPages);
    if (n !== current) onPageChange?.(n);
  };

  const changeSize = (e) => {
    const n = Number(e.target.value) || size;
    onPageSizeChange?.(n);
  };

  // Build a compact range with ellipsis
  const buildPages = () => {
    const pages = [];
    const add = (n) => pages.push(n);
    const addEllipsis = () => pages.push('...');

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) add(i);
    } else {
      const showLeft = Math.max(2, current - 1);
      const showRight = Math.min(totalPages - 1, current + 1);
      add(1);
      if (showLeft > 2) addEllipsis();
      for (let i = showLeft; i <= showRight; i += 1) add(i);
      if (showRight < totalPages - 1) addEllipsis();
      add(totalPages);
    }
    return pages;
  };

  const pages = buildPages();

  return (
    <div className="d-flex align-items-center justify-content-between w-100">
      <div className="text-muted small">
        Mostrando {start}-{end} de {total}
      </div>

      <div className="d-flex align-items-center">
        <div className="mr-3 d-flex align-items-center">
          <span className="mr-2 text-muted small">Mostrar</span>
          <select
            className="custom-select custom-select-sm"
            value={size}
            onChange={changeSize}
            style={{ width: 90 }}
            aria-label="Tamaño de página"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <nav aria-label="Paginación">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${current === 1 ? 'disabled' : ''}`}>
              <button type="button" className="page-link" onClick={() => changePage(current - 1)} aria-label="Anterior">
                &laquo;
              </button>
            </li>

            {pages.map((p, idx) => (
              p === '...' ? (
                <li key={`e-${idx}`} className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              ) : (
                <li key={p} className={`page-item ${p === current ? 'active' : ''}`}>
                  <button type="button" className="page-link" onClick={() => changePage(p)}>
                    {p}
                  </button>
                </li>
              )
            ))}

            <li className={`page-item ${current === totalPages ? 'disabled' : ''}`}>
              <button type="button" className="page-link" onClick={() => changePage(current + 1)} aria-label="Siguiente">
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
