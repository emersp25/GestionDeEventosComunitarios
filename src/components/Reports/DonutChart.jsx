import React, { useEffect, useRef } from 'react';


export default function DonutChart({ confirmed = 0, active = 0, style }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !window.Chart) return;

    // Destruir instancia previa si existe
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Confirmadas', 'Activas'],
        datasets: [
          {
            data: [confirmed, active],
            backgroundColor: ['#22c55e', '#3b82f6'],
            borderColor: '#111827'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' },
          title: { display: true, text: 'Distribución de inscripciones' }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [confirmed, active]);

  return (
    <div style={style}>
      <canvas ref={canvasRef} />
    </div>
  );
}
