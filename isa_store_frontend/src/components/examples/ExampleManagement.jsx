import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './ExamplePage.css'
import './ExampleManagement.css'

const VARIANTS = {
  '1': {
    brand: '⚙ AdminSys',
    sector: 'Gestión Empresarial',
    sidebarBg: '#1e1b4b',
    navAccent: '#7c3aed',
    kpiAccents: ['#7c3aed','#6d28d9','#4f46e5','#7c3aed'],
    kpis: [
      { label:'Ventas del mes',     val:'$12,400',  delta:'+8%',  up:true,  icon:'💰' },
      { label:'Pedidos activos',    val:'84',       delta:'+12',  up:true,  icon:'📦' },
      { label:'Clientes nuevos',    val:'37',       delta:'+5',   up:true,  icon:'👤' },
      { label:'Tasa de retención',  val:'94%',      delta:'-1%',  up:false, icon:'🔄' },
    ],
    bars: [35,58,42,75,60,88,64],
    barColor: '#7c3aed', barDim: '#ddd6fe',
    nav: ['Dashboard','Productos','Pedidos','Clientes','Reportes','Configuración'],
    orders: [
      { id:'#1234', client:'Ana Pérez',    date:'Hoy 10:04',  status:'Entregado', total:'$128.00' },
      { id:'#1233', client:'Luis Torres',  date:'Hoy 09:15',  status:'En camino', total:'$89.50' },
      { id:'#1232', client:'María García', date:'Ayer 04:38', status:'Procesando',total:'$245.00' },
      { id:'#1231', client:'Carlos Ruiz',  date:'Ayer 02:20', status:'Entregado', total:'$67.00' },
      { id:'#1230', client:'Sofía León',   date:'Ayer 11:08', status:'Cancelado', total:'$310.00' },
    ],
    activity: [['📦','Nuevo pedido #1234','Hoy 10:04'],['💳','Pago recibido $128','Hoy 09:10'],['👤','Nuevo cliente registrado','Ayer 04:38'],['✏️','Producto actualizado','Ayer 02:20']],
  },
  '2': {
    brand: '🏥 ClinicPro',
    sector: 'Clínica & Consultorio',
    sidebarBg: '#0f2744',
    navAccent: '#0369a1',
    kpiAccents: ['#0369a1','#0284c7','#0ea5e9','#0369a1'],
    kpis: [
      { label:'Citas hoy',          val:'24',       delta:'+3',   up:true,  icon:'📅' },
      { label:'Pacientes activos',  val:'312',      delta:'+18',  up:true,  icon:'👤' },
      { label:'Expedientes',        val:'1,840',    delta:'+12',  up:true,  icon:'📋' },
      { label:'Satisfacción',       val:'98%',      delta:'+1%',  up:true,  icon:'⭐' },
    ],
    bars: [60,45,70,55,80,65,50],
    barColor: '#0369a1', barDim: '#bae6fd',
    nav: ['Dashboard','Citas','Pacientes','Expedientes','Médicos','Configuración'],
    orders: [
      { id:'C-0842', client:'Roberto Mora',   date:'10:30',    status:'Confirmada', total:'Cardio' },
      { id:'C-0843', client:'Luisa Jiménez',  date:'11:00',    status:'En sala',    total:'General' },
      { id:'C-0844', client:'Pedro Arias',    date:'11:30',    status:'Pendiente',  total:'Pediatría' },
      { id:'C-0845', client:'Carmen Vega',    date:'12:00',    status:'Confirmada', total:'Derma' },
      { id:'C-0846', client:'Andrés Solano',  date:'12:30',    status:'Cancelada',  total:'Odonto' },
    ],
    activity: [['📅','Cita programada: R. Mora 10:30','Hoy 08:15'],['✅','Expediente actualizado','Hoy 07:50'],['💊','Receta generada #4821','Ayer 16:30'],['👤','Nuevo paciente registrado','Ayer 15:00']],
  },
}

const STATUS_COLORS = {
  'Entregado':'#059669','En camino':'#d97706','Procesando':'#3b82f6','Cancelado':'#ef4444',
  'Confirmada':'#059669','En sala':'#3b82f6','Pendiente':'#d97706','Cancelada':'#ef4444',
}

export default function ExampleManagement() {
  const { v = '1' } = useParams()
  const d = VARIANTS[v] || VARIANTS['1']
  const [active, setActive] = useState('Dashboard')

  if (v === '2') {
    const TIME_SLOTS = ['08:00','09:00','10:00','11:00','12:00','13:00']
    return (
      <div className="ex-mg2-page">
        <Link to="/services" className="example-back-btn">← Servicios</Link>

        {/* TOP NAVIGATION BAR */}
        <nav className="ex-mg2-topnav">
          <div>
            <div className="ex-mg2-brand">{d.brand}</div>
            <div className="ex-mg2-sector">{d.sector}</div>
          </div>
          <div className="ex-mg2-nav">
            {['Dashboard','Citas','Pacientes','Médicos'].map(n => (
              <a key={n} href="#" className={active === n ? 'active' : ''} onClick={e => { e.preventDefault(); setActive(n) }}>{n}</a>
            ))}
          </div>
          <div className="ex-mg2-topnav-right">
            <input className="ex-mg2-search" placeholder="🔍 Buscar…" />
            <button className="ex-mg2-notif">🔔</button>
            <div className="ex-mg2-avatar">A</div>
          </div>
        </nav>

        {/* BODY */}
        <div className="ex-mg2-body">

          {/* AGENDA HEADER */}
          <div className="ex-mg2-agenda-header">
            <div className="ex-mg2-agenda-title">Agenda de Hoy</div>
            <div className="ex-mg2-agenda-right">
              <div className="ex-mg2-date-chip">Vie, 6 Jun 2025</div>
              <select className="ex-mg2-doctor-sel">
                <option>Dr. General</option>
                <option>Dra. Martínez</option>
                <option>Dr. Ramírez</option>
              </select>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="ex-mg2-stats-strip">
            {d.kpis.map(k => (
              <div key={k.label} className="ex-mg2-stat-chip">
                <span className="ex-mg2-stat-icon">{k.icon}</span>
                <span className="ex-mg2-stat-val">{k.val}</span>
                <span className="ex-mg2-stat-label">{k.label}</span>
              </div>
            ))}
          </div>

          {/* TIME SLOTS TABLE */}
          <div className="ex-mg2-scheduler">
            {TIME_SLOTS.map((time, i) => {
              const appt = d.orders[i] || null
              const statusColor = appt ? (STATUS_COLORS[appt.status] || '#888') : null
              return (
                <div key={time} className="ex-mg2-slot-row">
                  <div className="ex-mg2-slot-time">{time}</div>
                  <div className="ex-mg2-slot-content">
                    {appt ? (
                      <div
                        className="ex-mg2-appt-card"
                        style={{ background: statusColor + '18', borderLeft: '3px solid ' + statusColor }}
                      >
                        <div className="ex-mg2-appt-patient">{appt.client}</div>
                        <div className="ex-mg2-appt-spec">{appt.total} · {appt.id}</div>
                        <span
                          className="ex-mg2-appt-status"
                          style={{ background: statusColor + '22', color: statusColor }}
                        >{appt.status}</span>
                      </div>
                    ) : (
                      <span className="ex-mg2-empty-slot">— Sin cita programada —</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* PRÓXIMAS CITAS (activity feed) */}
          <div className="ex-mg2-upcoming">
            <div className="ex-mg2-upcoming-title">Próximas citas</div>
            {d.activity.map(([ic, t, ts]) => (
              <div key={t} className="ex-mg2-upcoming-item">
                <span className="ex-mg2-upcoming-icon">{ic}</span>
                <div className="ex-mg2-upcoming-text">
                  <b>{t}</b>
                  <small>{ts}</small>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="ex-page ex-mg">
      <Link to="/services" className="example-back-btn">← Servicios</Link>
      <div className="ex-mg-layout">
        <aside className="ex-mg-sidebar" style={{ background: d.sidebarBg }}>
          <div className="ex-mg-brand">{d.brand}</div>
          <div className="ex-mg-sector">{d.sector}</div>
          <nav className="ex-mg-nav">
            {d.nav.map(n => (
              <button key={n} className={active === n ? 'active' : ''} onClick={() => setActive(n)}
                style={active === n ? { background: d.navAccent } : {}}>
                {n}
              </button>
            ))}
          </nav>
          <div className="ex-mg-user">
            <div className="ex-mg-avatar" style={{ background: d.navAccent }}>A</div>
            <div><b>Admin</b><small>admin@empresa.com</small></div>
          </div>
        </aside>

        <main className="ex-mg-main">
          <div className="ex-mg-topbar">
            <h1>Dashboard · <span style={{ color: d.navAccent, fontSize: '0.9em' }}>{d.sector}</span></h1>
            <div className="ex-mg-topbar-right">
              <input className="ex-mg-search" placeholder="🔍 Buscar…" />
              <button className="ex-mg-notif">🔔</button>
            </div>
          </div>

          <div className="ex-mg-kpis">
            {d.kpis.map((k, i) => (
              <div key={k.label} className="ex-mg-kpi" style={{ borderTop: `3px solid ${d.kpiAccents[i]}` }}>
                <div className="ex-mg-kpi-top"><span>{k.icon}</span><span className={`ex-mg-delta ${k.up ? 'up' : 'down'}`}>{k.delta}</span></div>
                <div className="ex-mg-kpi-val">{k.val}</div>
                <div className="ex-mg-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="ex-mg-cards-row">
            <div className="ex-mg-card ex-mg-chart-card">
              <div className="ex-mg-card-head"><b>{v === '1' ? 'Ventas de la semana' : 'Citas por día'}</b><small>últimos 7 días</small></div>
              <div className="ex-mg-chart">
                {d.bars.map((h, i) => (
                  <div key={i} className="ex-mg-bar-wrap">
                    <div className="ex-mg-bar" style={{ height: `${h}%`, background: i === 5 ? d.barColor : d.barDim }} />
                    <span>{'LMXJVSD'[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ex-mg-card ex-mg-activity-card">
              <div className="ex-mg-card-head"><b>Actividad reciente</b></div>
              {d.activity.map(([ic, t, ts]) => (
                <div key={t} className="ex-mg-activity-item">
                  <span>{ic}</span><div><b>{t}</b><small>{ts}</small></div>
                </div>
              ))}
            </div>
          </div>

          <div className="ex-mg-card">
            <div className="ex-mg-card-head">
              <b>{v === '1' ? 'Pedidos recientes' : 'Citas de hoy'}</b>
              <a href="#" className="ex-mg-ver-todos" style={{ color: d.navAccent }}>Ver todos →</a>
            </div>
            <table className="ex-mg-table">
              <thead><tr>
                <th>{v === '1' ? 'Pedido' : 'Cita'}</th>
                <th>{v === '1' ? 'Cliente' : 'Paciente'}</th>
                <th>{v === '1' ? 'Fecha' : 'Hora'}</th>
                <th>Estado</th>
                <th>{v === '1' ? 'Total' : 'Especialidad'}</th>
              </tr></thead>
              <tbody>
                {d.orders.map(o => (
                  <tr key={o.id}>
                    <td className="ex-mg-order-id" style={{ color: d.navAccent }}>{o.id}</td>
                    <td>{o.client}</td>
                    <td className="ex-mg-date">{o.date}</td>
                    <td><span className="ex-mg-status" style={{ background: (STATUS_COLORS[o.status] || '#888') + '22', color: STATUS_COLORS[o.status] || '#888' }}>{o.status}</span></td>
                    <td className="ex-mg-total">{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
