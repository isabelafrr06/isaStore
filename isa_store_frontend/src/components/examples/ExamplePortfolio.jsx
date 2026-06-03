import React from 'react'
import { Link, useParams } from 'react-router-dom'
import './ExamplePage.css'
import './ExamplePortfolio.css'

const U = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`

const VARIANTS = {
  '1': {
    name: 'María López', title: 'Diseñadora & Desarrolladora Web', city: 'San José, Costa Rica',
    bio: 'Creo sitios web modernos, rápidos y funcionales para emprendedores y empresas en Costa Rica y el mundo.',
    accent: '#ec4899', accentGrad: 'linear-gradient(135deg,#ec4899,#a855f7)',
    heroBg: 'linear-gradient(135deg,#fdf2f8 0%,#faf5ff 50%,#ede9fe 100%)',
    tagBg: '#fce7f3', tagColor: '#be185d',
    skills: ['React','Node.js','Rails','Next.js','PostgreSQL','Figma','Tailwind','TypeScript'],
    stats: [{ val:'25+', label:'Proyectos' },{ val:'18', label:'Clientes' },{ val:'4 años', label:'Experiencia' }],
    projects: [
      { title:'E-commerce TechStore',    tags:['React','Node.js'],     img:U('1472851294608-062f824d29cc'),      span:'large' },
      { title:'App Restaurante',          tags:['React Native'],        img:U('1517248135467-4c7edcad34c4'),      span:'' },
      { title:'Dashboard Financiero',    tags:['Vue.js','D3.js'],      img:U('1551288049-bebda4e38f71'),          span:'' },
      { title:'Menú Digital QR',         tags:['Next.js'],             img:U('1555396273-367ea4eb4db5'),          span:'wide' },
      { title:'Portfolio Arquitecto',    tags:['React'],               img:U('1488188840666-e2e8d9f7a5e6'),       span:'' },
      { title:'Sistema Inventario',      tags:['Rails','React'],       img:U('1460925895917-afdab827c52f'),       span:'' },
    ],
  },
  '2': {
    name: 'Andrés Silva', title: 'Fotógrafo Profesional', city: 'Guanacaste, Costa Rica',
    bio: 'Capturo momentos únicos para bodas, empresas y sesiones de retrato en toda Costa Rica y el extranjero.',
    accent: '#f59e0b', accentGrad: 'linear-gradient(135deg,#f59e0b,#d97706)',
    heroBg: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
    tagBg: '#fef3c7', tagColor: '#b45309',
    skills: ['Lightroom','Photoshop','Capture One','Drone DJI','Sony A7 IV','Video 4K','Iluminación'],
    stats: [{ val:'500+', label:'Sesiones' },{ val:'120', label:'Bodas' },{ val:'8 años', label:'Experiencia' }],
    projects: [
      { title:'Boda en Tamarindo',       tags:['Wedding','Outdoor'],   img:U('1519741497674-611481863552'),       span:'large' },
      { title:'Retrato Corporativo',     tags:['Corporate'],           img:U('1573497491208-6b1acb260507'),       span:'' },
      { title:'Paisaje Costero',         tags:['Landscape','Drone'],   img:U('1506905925346-21bda4d32df4'),       span:'' },
      { title:'Evento Empresarial',      tags:['Events','Indoor'],     img:U('1540575467537-8a9f5a3d07b5'),       span:'wide' },
      { title:'Moda Editorial',          tags:['Fashion','Studio'],    img:U('1483985988355-763728e1ccf2'),        span:'' },
      { title:'Familia en Naturaleza',   tags:['Family','Outdoor'],    img:U('1511895426328-dc8714191011'),        span:'' },
    ],
  },
}

export default function ExamplePortfolio() {
  const { v = '1' } = useParams()
  const d = VARIANTS[v] || VARIANTS['1']
  const isDark = v === '2'

  return (
    <div className="ex-page ex-pf" style={isDark ? { background: '#0f172a' } : {}}>
      <Link to="/services" className="example-back-btn">← Servicios</Link>

      <header className="ex-pf-header" style={isDark ? { background: '#1e293b', borderBottomColor: '#334155' } : {}}>
        <div className="ex-pf-header-inner">
          <span className="ex-pf-logo" style={isDark ? { color: 'white' } : {}}>{d.name}</span>
          <nav>
            {['Inicio','Proyectos','Sobre mí','Contacto'].map(n => (
              <a key={n} href="#" style={isDark ? { color: 'rgba(255,255,255,0.7)' } : {}}>{n}</a>
            ))}
          </nav>
          <a href="#" className="ex-pf-hire" style={{ background: d.accentGrad }}>Contrátame</a>
        </div>
      </header>

      <section className="ex-pf-hero" style={{ background: d.heroBg }}>
        <div className="ex-pf-hero-inner">
          <div className="ex-pf-tag" style={{ background: d.tagBg, color: d.tagColor }}>
            Disponible · {d.city}
          </div>
          <h1 style={isDark ? { color: 'white' } : {}}>{d.title}</h1>
          <p style={isDark ? { color: 'rgba(255,255,255,0.65)' } : {}}>{d.bio}</p>
          <div className="ex-pf-hero-btns">
            <button className="ex-pf-btn-primary" style={{ background: d.accentGrad }}>
              {v === '1' ? 'Ver Proyectos' : 'Ver Galería'}
            </button>
            <button className="ex-pf-btn-outline" style={{ color: d.accent, borderColor: d.accent }}>
              {v === '1' ? 'Descargar CV' : 'Reservar Sesión'}
            </button>
          </div>
          <div className="ex-pf-hero-stats">
            {d.stats.map(s => (
              <span key={s.label} style={isDark ? { color: 'rgba(255,255,255,0.7)' } : {}}>
                <b style={isDark ? { color: 'white' } : {}}>{s.val}</b> {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="ex-pf-projects" style={isDark ? { background: '#1e293b' } : {}}>
        <div className="ex-pf-projects-inner">
          <h2 style={isDark ? { color: 'white' } : {}}>
            {v === '1' ? 'Proyectos Destacados' : 'Galería de Trabajos'}
          </h2>
          <p className="ex-pf-projects-sub" style={isDark ? { color: 'rgba(255,255,255,0.5)' } : {}}>
            {v === '1' ? 'Una selección de mis mejores trabajos' : 'Cada imagen cuenta una historia'}
          </p>
          <div className="ex-pf-grid">
            {d.projects.map((p, i) => (
              <div key={i} className={`ex-pf-tile ${p.span}`}>
                <img src={p.img} alt={p.title} loading="lazy" className="ex-pf-tile-img" />
                <div className="ex-pf-tile-overlay">
                  <h3>{p.title}</h3>
                  <div className="ex-pf-tile-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
                  <button style={{ color: d.accent }}>Ver →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ex-pf-skills" style={isDark ? { background: '#0f172a' } : {}}>
        <div className="ex-pf-skills-inner">
          <h2>{v === '1' ? 'Tecnologías' : 'Herramientas'}</h2>
          <div className="ex-pf-skills-list">
            {d.skills.map(s => <span key={s} className="ex-pf-skill">{s}</span>)}
          </div>
        </div>
      </section>

      <section className="ex-pf-cta" style={isDark ? { background: '#1e293b' } : {}}>
        <h2 style={isDark ? { color: 'white' } : {}}>
          {v === '1' ? '¿Tienes un proyecto en mente?' : '¿Listo para tu sesión?'}
        </h2>
        <p style={isDark ? { color: 'rgba(255,255,255,0.6)' } : {}}>
          {v === '1' ? 'Cuéntame tu idea y lo hacemos realidad juntos.' : 'Reserva con anticipación y asegura tu fecha.'}
        </p>
        <div className="ex-pf-cta-btns">
          <a href="#" className="ex-pf-cta-wa">💬 WhatsApp</a>
          <a href="#" className="ex-pf-cta-email" style={{ background: d.accentGrad }}>✉ Email</a>
        </div>
      </section>

      <footer className="ex-footer"><p>© 2025 {d.name} · {d.city}</p></footer>
    </div>
  )
}
