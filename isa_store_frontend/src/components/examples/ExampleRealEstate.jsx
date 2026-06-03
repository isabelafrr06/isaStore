import React from 'react'
import { Link, useParams } from 'react-router-dom'
import './ExamplePage.css'
import './ExampleRealEstate.css'

const U = (id, w = 420, h = 240) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`

const VARIANTS = {
  '1': {
    brand: '🏠 InmoXYZ',
    tagline: 'Encuentra tu hogar ideal',
    sub: 'Miles de propiedades en venta y renta en todo el país',
    accent: '#2563eb', header: '#1e3a8a',
    hero: 'linear-gradient(135deg,#1e3a8a 0%,#2563eb 60%,#3b82f6 100%)',
    properties: [
      { badge:'Venta', name:'Residencia Las Lomas',   loc:'Ciudad de México', beds:4, baths:3, m2:320, price:'$2,450,000', img:U('1570129477492-45c003edd2be') },
      { badge:'Renta', name:'Departamento Reforma',   loc:'Guadalajara',      beds:2, baths:2, m2:95,  price:'$18,000/mes', img:U('1522708323590-d24dbb6b0267') },
      { badge:'Venta', name:'Villa Santa Fe',         loc:'Monterrey',        beds:5, baths:4, m2:450, price:'$4,200,000', img:U('1580587771525-4245d7a2e5e9') },
      { badge:'Venta', name:'Casa del Lago',          loc:'Querétaro',        beds:3, baths:2, m2:210, price:'$1,800,000', img:U('1564013799919-ab600027ffc6') },
      { badge:'Renta', name:'Penthouse Centro',       loc:'CDMX',             beds:2, baths:2, m2:120, price:'$32,000/mes', img:U('1512917774080-9991f1c4c750') },
      { badge:'Venta', name:'Hacienda San Luis',      loc:'Jalisco',          beds:6, baths:5, m2:800, price:'$8,500,000', img:U('1449844908441-8a77116aa00e') },
    ],
  },
  '2': {
    brand: '🌿 CasasCR',
    tagline: 'Tu hogar en Costa Rica',
    sub: 'Las mejores propiedades en el Valle Central y Guanacaste',
    accent: '#059669', header: '#064e3b',
    hero: 'linear-gradient(135deg,#064e3b 0%,#047857 60%,#10b981 100%)',
    properties: [
      { badge:'Venta', name:'Casa en Escazú',        loc:'San José',         beds:3, baths:2, m2:180, price:'₡85,000,000', img:U('1416331108676-a22ccb276e35') },
      { badge:'Renta', name:'Apto Rohrmoser',        loc:'San José',         beds:1, baths:1, m2:65,  price:'₡450,000/mes',img:U('1502005229762-f8b3d0e44a51') },
      { badge:'Venta', name:'Finca en Atenas',       loc:'Alajuela',         beds:4, baths:3, m2:520, price:'₡120,000,000',img:U('1500076656116-558758f0fd93') },
      { badge:'Venta', name:'Casa en Lindora',       loc:'Santa Ana',        beds:3, baths:2, m2:220, price:'₡95,000,000', img:U('1518780664697-05070b181ad8') },
      { badge:'Renta', name:'Loft Barrio Dent',      loc:'San Pedro',        beds:1, baths:1, m2:55,  price:'₡350,000/mes',img:U('1484154951234-5ac6b6b4aaff') },
      { badge:'Venta', name:'Casa de Playa',         loc:'Guanacaste',       beds:4, baths:3, m2:300, price:'₡250,000,000',img:U('1507525428034-b723cf961d3e') },
    ],
  },
}

export default function ExampleRealEstate() {
  const { v = '1' } = useParams()
  const d = VARIANTS[v] || VARIANTS['1']

  return (
    <div className="ex-page ex-re">
      <Link to="/services" className="example-back-btn">← Servicios</Link>

      <header className="ex-re-header" style={{ background: d.header }}>
        <div className="ex-re-header-inner">
          <span className="ex-re-logo">{d.brand}</span>
          <nav>
            <a href="#">Inicio</a><a href="#" className="act">Propiedades</a>
            <a href="#">Agentes</a><a href="#">Contacto</a>
          </nav>
          <button className="ex-re-cta-btn" style={{ background: d.accent }}>Publicar</button>
        </div>
      </header>

      <section className="ex-re-hero" style={{ background: d.hero }}>
        <h1>{d.tagline}</h1>
        <p>{d.sub}</p>
        <div className="ex-re-search">
          <input placeholder="Ubicación, ciudad o zona…" />
          <select><option>Cualquier precio</option><option>Económico</option><option>Medio</option><option>Lujo</option></select>
          <select><option>Cualquier tipo</option><option>Casa</option><option>Apartamento</option><option>Terreno</option></select>
          <button style={{ background: d.accent }}>🔍 Buscar</button>
        </div>
        <div className="ex-re-stats">
          <span><b>1,240+</b> Propiedades</span>
          <span><b>320</b> Agentes</span>
          <span><b>5,800</b> Familias</span>
        </div>
      </section>

      <section className="ex-re-listings">
        <h2>Propiedades Destacadas</h2>
        <p className="ex-re-sub">Las propiedades más exclusivas de nuestro portafolio</p>
        <div className="ex-re-grid">
          {d.properties.map((p, i) => (
            <div key={i} className="ex-re-card">
              <div className="ex-re-img">
                <img src={p.img} alt={p.name} loading="lazy" />
                <span className="ex-re-badge"
                  style={{ background: p.badge === 'Venta' ? d.accent : '#059669' }}>
                  {p.badge}
                </span>
              </div>
              <div className="ex-re-body">
                <h3>{p.name}</h3>
                <p className="ex-re-loc">📍 {p.loc}</p>
                <div className="ex-re-meta">
                  <span>🛏 {p.beds} hab.</span><span>🚿 {p.baths} baños</span><span>📐 {p.m2} m²</span>
                </div>
                <div className="ex-re-foot">
                  <span className="ex-re-price" style={{ color: d.accent }}>{p.price}</span>
                  <button style={{ color: d.accent, borderColor: d.accent + '44', background: d.accent + '11' }}>Detalles</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="ex-footer">
        <p>© 2025 {d.brand.replace(/^. /, '')} · Todos los derechos reservados</p>
      </footer>
    </div>
  )
}
