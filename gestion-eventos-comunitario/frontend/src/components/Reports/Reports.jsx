import React, { useEffect, useMemo, useState } from 'react';
import { getEvents } from '../../api/events.js';
import { getInscritosPorEvento, getEventosPorMes, getTopEventos, getTotales } from '../../api/reports.js';
import '../../style/Reports.css';
import EventSelector from './EventSelector.jsx';
import StatsSummary from './StatsSummary.jsx';
import DonutChart from './DonutChart.jsx';
import TopEventsBarChart from './TopEventsBarChart.jsx';
import MonthlyEventsBarChart from './MonthlyEventsBarChart.jsx';
import TotalsKpis from './TotalsKpis.jsx';


export default function Reports() {
  const [items, setItems] = useState([]);
  const [eventNameById, setEventNameById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [errorReport, setErrorReport] = useState(null);

  // Eventos por mes - estado y filtros
  const [monthly, setMonthly] = useState([]);
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [errorMonthly, setErrorMonthly] = useState(null);
  const [filterMode, setFilterMode] = useState('year'); // 'year' | 'range'
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Top eventos (backend)
  const [topLimit, setTopLimit] = useState(5);
  const [topBackend, setTopBackend] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [errorTop, setErrorTop] = useState(null);

  // Totales KPIs (backend)
  const [totalsStart, setTotalsStart] = useState('');
  const [totalsEnd, setTotalsEnd] = useState('');
  const [totals, setTotals] = useState(null);
  const [loadingTotals, setLoadingTotals] = useState(false);
  const [errorTotals, setErrorTotals] = useState(null);

  // Carga dinámica de Chart.js desde CDN (si no está ya cargado)
  useEffect(() => {
    let scriptEl = document.querySelector('script[data-chartjs]');
    if (scriptEl && window.Chart) return;

    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      scriptEl.async = true;
      scriptEl.setAttribute('data-chartjs', 'true');
      document.body.appendChild(scriptEl);
    }
  }, []);

  // Fetch de inscripciones
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const evs = await getEvents();
        if (!cancelled) {
          const map = {};
          (Array.isArray(evs) ? evs : []).forEach((ev) => {
            if (ev && ev.id) map[ev.id] = ev.nombre || String(ev.id);
          });
          setEventNameById(map);
          setEvents(Array.isArray(evs) ? evs : []);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Error al cargar inscripciones');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Seleccionar por defecto el primer evento cuando se cargan
  useEffect(() => {
    if (!selectedEventId && Array.isArray(events) && events.length > 0) {
      setSelectedEventId(String(events[0].id));
    }
  }, [events, selectedEventId]);

  // Cargar reporte de inscritos al cambiar el evento seleccionado
  useEffect(() => {
    let cancelled = false;
    async function fetchReport() {
      if (!selectedEventId) {
        setReport(null);
        setErrorReport(null);
        return;
      }
      try {
        setLoadingReport(true);
        setErrorReport(null);
        const data = await getInscritosPorEvento(selectedEventId);
        if (!cancelled) setReport(data);
      } catch (err) {
        if (!cancelled) setErrorReport(err?.message || 'Error al cargar reporte de inscritos');
      } finally {
        if (!cancelled) setLoadingReport(false);
      }
    }
    fetchReport();
    return () => { cancelled = true; };
  }, [selectedEventId]);

  // Cargar eventos por mes según filtros (año o rango)
  useEffect(() => {
    let cancelled = false;
    async function fetchMonthly() {
      try {
        setLoadingMonthly(true);
        setErrorMonthly(null);
        const toIso = (v) => (v ? new Date(v).toISOString() : undefined);
        // Para mayor compatibilidad con el backend, al filtrar por año también enviamos startDate y endDate del año completo (UTC)
        const startISO = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)).toISOString();
        const endISO = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)).toISOString();
        const params = filterMode === 'year'
          ? { year, startDate: startISO, endDate: endISO }
          : { startDate: toIso(startDate), endDate: toIso(endDate) };
        const data = await getEventosPorMes(params);
        const payload = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

        if (!cancelled) setMonthly(payload);
      } catch (err) {
        if (!cancelled) setErrorMonthly(err?.message || 'Error al cargar eventos por mes');
      } finally {
        if (!cancelled) setLoadingMonthly(false);
      }
    }
    fetchMonthly();
    return () => { cancelled = true; };
  }, [filterMode, year, startDate, endDate, events]);

  // Cargar Top eventos desde backend según límite
  useEffect(() => {
    let cancelled = false;
    async function fetchTop() {
      try {
        setLoadingTop(true);
        setErrorTop(null);
        const data = await getTopEventos(topLimit);
        const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        if (!cancelled) setTopBackend(arr);
      } catch (err) {
        if (!cancelled) setErrorTop(err?.message || 'Error al cargar top eventos');
      } finally {
        if (!cancelled) setLoadingTop(false);
      }
    }
    fetchTop();
    return () => { cancelled = true; };
  }, [topLimit]);

  // Cargar totales (KPIs) según rango de fechas
  useEffect(() => {
    let cancelled = false;
    async function fetchTotals() {
      // No enviar datos por defecto: si no hay rango, no se consulta y no se muestra nada
      if (!totalsStart && !totalsEnd) {
        if (!cancelled) {
          setTotals(null);
          setErrorTotals(null);
          setLoadingTotals(false);
        }
        return;
      }
      try {
        setLoadingTotals(true);
        setErrorTotals(null);
        const toIso = (v) => (v ? new Date(v).toISOString() : undefined);
        const params = { startDate: toIso(totalsStart), endDate: toIso(totalsEnd) };
        const data = await getTotales(params);
        const obj = data && data.data ? data.data : data;
        if (!cancelled) setTotals(obj ?? null);
      } catch (err) {
        if (!cancelled) setErrorTotals(err?.message || 'Error al cargar totales');
      } finally {
        if (!cancelled) setLoadingTotals(false);
      }
    }
    fetchTotals();
    return () => { cancelled = true; };
  }, [totalsStart, totalsEnd]);

  const monthlyItems = useMemo(() => {
    const arr = Array.isArray(monthly) ? monthly : [];
    return arr
      .slice()
      .sort((a, b) => (a.year - b.year) || (a.month - b.month))
      .map((r) => ({
        name: `${String(r.year)}-${String(r.month).padStart(2, '0')}`,
        count: r.total ?? 0
      }));
  }, [monthly]);

  const topBackendItems = useMemo(() => {
    const arr = Array.isArray(topBackend) ? topBackend : [];
    return arr.map((it) => ({
      name: it.nombre || it.name || (it.eventId ? String(it.eventId) : 'Sin nombre'),
      count: it.totalInscritos ?? it.total ?? 0
    }));
  }, [topBackend]);

  // Helpers para extraer nombre de evento y timestamp con tolerancia a diferentes esquemas
  const getEventName = (it) =>
    it?.eventNombre ?? eventNameById[it?.eventId] ?? it?.evento?.nombre ?? it?.nombreEvento ?? it?.eventName ?? it?.evento ?? it?.event ?? it?.nombre ?? (it?.eventId ? String(it.eventId) : 'Sin nombre');

  const getTimestamp = (it) => {
    const raw =
      it?.fechaInscripcion ?? it?.createdAt ?? it?.fecha ?? it?.timestamp ?? it?.created_at ?? it?.fechaCreacion ?? it?.fechaRegistro;
    const d = raw ? new Date(raw) : null;
    return d && !isNaN(d.getTime()) ? d.getTime() : null;
  };

  // Transformación: agrupar por evento, contar, y ordenar por última inscripción descendente
  const top10 = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const map = new Map(); // eventName -> { count, latestTs }
    for (const it of items) {
      const name = getEventName(it);
      const ts = getTimestamp(it);
      const prev = map.get(name) || { count: 0, latestTs: null };
      const latestTs = prev.latestTs == null ? ts : Math.max(prev.latestTs ?? 0, ts ?? 0);
      map.set(name, { count: prev.count + 1, latestTs });
    }
    const arr = Array.from(map.entries()).map(([name, v]) => ({ name, count: v.count, latestTs: v.latestTs ?? 0 }));
    // Orden: más recientes primero
    arr.sort((a, b) => (b.latestTs - a.latestTs) || (b.count - a.count));
    return arr.slice(0, 10);
  }, [items, eventNameById]);



  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0">Reportes</h3>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    // Reintentar fetch
                    setLoading(true);
                    setError(null);
                    getEvents()
                      .then((evs) => {
                        const map = {};
                        (Array.isArray(evs) ? evs : []).forEach((ev) => {
                          if (ev && ev.id) map[ev.id] = ev.nombre || String(ev.id);
                        });
                        setEventNameById(map);
                        setEvents(Array.isArray(evs) ? evs : []);
                      })
                      .catch((err) => setError(err?.message || 'Error al recargar'))
                      .finally(() => setLoading(false));
                  }}
                >
                  <i className="fas fa-sync-alt mr-1"></i> Actualizar
                </button>
              </div>
              <div className="card-body">
                <div className="report-section section-inscritos mb-4 p-3 rounded">
                  <div className="section-header d-flex align-items-center justify-content-between mb-2">
                    <h5 className="mb-0"><i className="fas fa-user-check mr-2"></i> Inscritos por evento</h5>
                    {selectedEventId && (report?.eventNombre || eventNameById[selectedEventId]) && (
                      <span className="badge badge-light text-dark">
                        {report?.eventNombre || eventNameById[selectedEventId]}
                      </span>
                    )}
                  </div>

                  <div className="form-row align-items-end mt-2">
                    <EventSelector
                      events={events}
                      selected={selectedEventId}
                      onChange={setSelectedEventId}
                    />
                    <div className="form-group col-md-6">
                      <div className="d-flex flex-wrap align-items-center">
                        <StatsSummary
                          total={report?.totalInscripciones ?? 0}
                          active={report?.totalInscripcionesActivas ?? 0}
                          confirmed={
                            Array.isArray(report?.items)
                              ? report.items.filter(i => i.status === 'CONFIRMADA').length
                              : Math.max((report?.totalInscripciones ?? 0) - (report?.totalInscripcionesActivas ?? 0), 0)
                          }
                        />
                        <DonutChart
                          confirmed={
                            Array.isArray(report?.items)
                              ? report.items.filter(i => i.status === 'CONFIRMADA').length
                              : Math.max((report?.totalInscripciones ?? 0) - (report?.totalInscripcionesActivas ?? 0), 0)
                          }
                          active={report?.totalInscripcionesActivas ?? 0}
                          style={{ width: 180, height: 180 }}
                        />
                      </div>
                    </div>
                  </div>

                  {loadingReport && <p className="text-muted">Cargando inscritos...</p>}
                  {errorReport && <p className="text-danger">Error: {errorReport}</p>}
                </div>


                <div className="row align-items-stretch mb-4">
                  <div className="col-lg-6 col-md-12 d-flex">
                    <div className="report-section section-mensual mb-4 p-3 rounded d-flex flex-column h-100 w-100">
                      <div className="section-header d-flex align-items-center justify-content-between mb-2">
                        <h5 className="mb-0"><i className="fas fa-calendar-alt mr-2"></i> Eventos por mes</h5>
                      </div>
                      <div className="d-flex flex-wrap align-items-end mb-2">
                        <div className="form-check form-check-inline mr-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="filterYear"
                            name="monthlyFilter"
                            checked={filterMode === 'year'}
                            onChange={() => setFilterMode('year')}
                          />
                          <label className="form-check-label" htmlFor="filterYear">Por año</label>
                        </div>
                        <div className="form-check form-check-inline mr-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="filterRange"
                            name="monthlyFilter"
                            checked={filterMode === 'range'}
                            onChange={() => setFilterMode('range')}
                          />
                          <label className="form-check-label" htmlFor="filterRange">Por rango</label>
                        </div>
                        <div className="form-group mb-0 mr-3">
                          <label className="mb-0 mr-2">Año</label>
                          <input
                            type="number"
                            className="form-control"
                            min="2000"
                            max="2100"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            disabled={filterMode !== 'year'}
                            style={{ width: 120 }}
                          />
                        </div>
                        <div className="form-group mb-0 mr-3">
                          <label className="mb-0 mr-2">Inicio</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            disabled={filterMode !== 'range'}
                            style={{ width: 200 }}
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label className="mb-0 mr-2">Fin</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            disabled={filterMode !== 'range'}
                            style={{ width: 200 }}
                          />
                        </div>
                      </div>

                      {loadingMonthly && <p className="text-muted">Cargando eventos por mes...</p>}
                      {errorMonthly && <p className="text-danger">Error: {errorMonthly}</p>}
                      <div className="flex-grow-1 d-flex">
                        {!loadingMonthly && !errorMonthly && monthlyItems.length > 0 && (
                          <MonthlyEventsBarChart items={monthlyItems} height={360} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-12 d-flex">
                    <div className="report-section section-top mb-4 p-3 rounded d-flex flex-column h-100 w-100">
                      <div className="section-header d-flex align-items-center justify-content-between mb-2">
                        <h5 className="mb-0"><i className="fas fa-trophy mr-2"></i> Top eventos</h5>
                        <div className="form-inline">
                          <label className="mr-2">Límite</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            min="1"
                            max="50"
                            value={topLimit}
                            onChange={(e) => setTopLimit(Number(e.target.value) || 1)}
                            style={{ width: 90 }}
                          />
                        </div>
                      </div>
                      {loadingTop && <p className="text-muted">Cargando top eventos...</p>}
                      {errorTop && <p className="text-danger">Error: {errorTop}</p>}
                      <div className="flex-grow-1 d-flex">
                        {!loadingTop && !errorTop && topBackendItems.length > 0 && (
                          <TopEventsBarChart items={topBackendItems} height={360} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="report-section section-totales mb-4 p-3 rounded">
                  <div className="section-header d-flex align-items-center justify-content-between mb-2">
                    <h5 className="mb-0"><i className="fas fa-chart-pie mr-2"></i> Totales</h5>
                  </div>

                  <div className="form-row align-items-end mt-2">
                    <div className="form-group col-md-3">
                      <label>Inicio</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={totalsStart}
                        onChange={(e) => setTotalsStart(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-md-3">
                      <label>Fin</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={totalsEnd}
                        onChange={(e) => setTotalsEnd(e.target.value)}
                      />
                    </div>
                  </div>

                  {loadingTotals && <p className="text-muted">Cargando totales...</p>}
                  {errorTotals && <p className="text-danger">Error: {errorTotals}</p>}
                  {!loadingTotals && !errorTotals && totals && (
                    <TotalsKpis totals={totals} />
                  )}
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
