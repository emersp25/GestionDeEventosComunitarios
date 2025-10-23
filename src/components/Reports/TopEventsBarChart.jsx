import React, { useEffect, useRef } from 'react';


export default function TopEventsBarChart({ items = [], height = 300 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !window.Chart) return;

    // Destruir instancia previa si existe
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const labels = items.map((x) => x.name);
    const data = items.map((x) => x.count);

    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#e11d48', '#14b8a6'
    ];

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Inscritos',
            data,
            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
            borderColor: '#111827',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
            title: { display: true, text: 'Cantidad de inscripciones' }
          },
          x: {
            title: { display: true, text: 'Eventos (Top 10 por recencia)' }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          title: { display: true, text: 'Inscripciones por evento (Top 10 más recientes)' }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [items]);

  return (
    <div className="reports-chart-wrapper" style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
