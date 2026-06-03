import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './ExamplePage.css'
import './ExampleDigitalMenu.css'

const U = (id, w = 100, h = 100) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`

const VARIANTS = {
  '1': {
    brand: '☕ Café Luna', sub: 'Menú Digital · San José, CR',
    hours: '🕐 Lun – Vie: 7:00 – 21:00', address: '📍 Barrio La California, SJ',
    bg: '#0f172a', headerBg: '#1e293b', accent: '#10b981',
    cats: ['☕ Cafés','🥗 Ensaladas','🥪 Sandwiches','🍰 Postres'],
    menu: {
      '☕ Cafés': [
        { name:'Cappuccino Artesanal', desc:'Espresso doble con leche espumada texturizada a mano.',         price:'₡2,800', tag:'Popular',   tagC:'#f59e0b', img:U('1495474472287-4d71bcdd2085') },
        { name:'Matcha Latte',         desc:'Té matcha orgánico con leche de avena y sirope de vainilla.',   price:'₡3,200', tag:'Nuevo',     tagC:'#10b981', img:U('1556679343-c4229bf33a60') },
        { name:'Cold Brew',            desc:'Café preparado en frío 18 horas, suave y refrescante.',         price:'₡3,000', tag:'Sin azúcar',tagC:'#6366f1', img:U('1461023058943-07fcbe16d735') },
      ],
      '🥗 Ensaladas': [
        { name:'Bowl de Quinoa',       desc:'Quinoa tricolor, aguacate, cherry, pepino y aderezo tahini.',   price:'₡5,500', tag:'Vegano',    tagC:'#10b981', img:U('1512621776951-a57141f2eefd') },
        { name:'Ensalada César',       desc:'Lechuga romana, croutones caseros, parmesano y aderezo César.',price:'₡4,800', tag:'Clásico',   tagC:'#3b82f6', img:U('1546069901-ba9599a7e63c') },
        { name:'Ensalada Nicoise',     desc:'Atún, huevo cocido, aceituna, judías verdes y vinagreta.',     price:'₡5,200', tag:'Sin gluten',tagC:'#8b5cf6', img:U('1540914124561-3a09e4b57e62') },
      ],
      '🥪 Sandwiches': [
        { name:'Club Sándwich',        desc:'Pechuga de pollo, tocino, lechuga, tomate y mayonesa casera.', price:'₡5,800', tag:'Bestseller',tagC:'#f59e0b', img:U('1509722747841-65571cd27ec3') },
        { name:'Veggie Wrap',          desc:'Tortilla integral con hummus, vegetales asados y rúgula.',     price:'₡4,900', tag:'Vegano',    tagC:'#10b981', img:U('1565299585323-38d6b0865b47') },
        { name:'Croissant de Jamón',   desc:'Croissant de mantequilla con jamón serrano y queso brie.',    price:'₡5,200', tag:'Nuevo',     tagC:'#6366f1', img:U('1555507036-ab1902ccf989') },
      ],
      '🍰 Postres': [
        { name:'Tiramisú Casero',      desc:'Receta original italiana con mascarpone y café espresso.',     price:'₡3,400', tag:'Favorito',  tagC:'#f59e0b', img:U('1551024601-bec78aea704b') },
        { name:'Tarta de Limón',       desc:'Base de galleta, crema de limón y merengue tostado.',         price:'₡3,100', tag:'Sin gluten',tagC:'#8b5cf6', img:U('1571506165871-ee72a35bc9d4') },
        { name:'Brownie con Helado',   desc:'Brownie tibio de chocolate 70% con helado de vainilla.',      price:'₡3,600', tag:'Popular',   tagC:'#f59e0b', img:U('1606313564200-e75d5e30476c') },
      ],
    },
  },
  '2': {
    brand: '🔥 El Asador', sub: 'Menú Digital · BBQ & Grill',
    hours: '🕐 Mar – Dom: 12:00 – 23:00', address: '📍 Curridabat, San José',
    bg: '#1c0505', headerBg: '#2d0a0a', accent: '#ef4444',
    cats: ['🥩 Carnes','🌽 Acompañantes','🥗 Ensaladas','🍺 Bebidas'],
    menu: {
      '🥩 Carnes': [
        { name:'Costillas BBQ',        desc:'Costillas de cerdo ahumadas 6 horas con salsa BBQ casera.',    price:'₡12,500',tag:"Chef's Pick",tagC:'#f59e0b', img:U('1529193591184-b1d58069ecdd') },
        { name:'Brisket de Res',       desc:'Pecho de res ahumado a la leña, tierno y jugoso, 300g.',      price:'₡14,800',tag:'Signature', tagC:'#ef4444', img:U('1558030006-450675393462') },
        { name:'Alitas de Pollo',      desc:'Alitas marinadas en salsa picante o BBQ, con dip de queso.',  price:'₡8,900', tag:'Popular',   tagC:'#f59e0b', img:U('1527477396000-e27163b481c2') },
      ],
      '🌽 Acompañantes': [
        { name:'Maíz Asado',           desc:'Elote a la parrilla con mantequilla de chipotle y cotija.',   price:'₡2,500', tag:'Vegano',    tagC:'#10b981', img:U('1551754655-5f2fefddb32b') },
        { name:'Papas Ahumadas',       desc:'Papas al horno con tocino, crema ácida y cebollín.',          price:'₡3,200', tag:'Favorito',  tagC:'#f59e0b', img:U('1568901346375-96c6af8a5c22') },
        { name:'Coleslaw Casero',      desc:'Ensalada de repollo con zanahoria y aderezo cremoso casero.', price:'₡2,000', tag:'Sin gluten',tagC:'#8b5cf6', img:U('1512621776951-a57141f2eefd') },
      ],
      '🥗 Ensaladas': [
        { name:'Ensalada del Asador',  desc:'Lechuga, arándanos, nueces, queso azul y vinagreta de miel.',price:'₡4,500', tag:'Nuevo',     tagC:'#10b981', img:U('1540914124561-3a09e4b57e62') },
        { name:'Caprese al Grill',     desc:'Tomate y mozzarella asados con albahaca fresca y balsámico.',price:'₡4,200', tag:'Vegetariano',tagC:'#10b981',img:U('1476124369491-e7dde9c8b2e4') },
        { name:'Espinaca y Tocino',    desc:'Espinaca, tocino crujiente, huevo duro y aderezo tibio.',     price:'₡4,800', tag:'Proteínas', tagC:'#6366f1', img:U('1546069901-ba9599a7e63c') },
      ],
      '🍺 Bebidas': [
        { name:'Cerveza Artesanal',    desc:'Selección de 4 cervezas locales. Pregunta por las opciones.', price:'₡3,500',tag:'Local',      tagC:'#f59e0b', img:U('1510812431401-41d2bd2722f3') },
        { name:'Limonada con Chile',   desc:'Limonada fresca con borde de chile y sal, sin alcohol.',     price:'₡2,500', tag:'Sin alcohol',tagC:'#10b981', img:U('1557142046-c704a3adf364') },
        { name:'Agua de Horchata',     desc:'Horchata tradicional con canela, arroz y vainilla.',          price:'₡2,000', tag:'Tradicional',tagC:'#8b5cf6',img:U('1505252585461-5b8fb07849d7') },
      ],
    },
  },
}

export default function ExampleDigitalMenu() {
  const { v = '1' } = useParams()
  const d = VARIANTS[v] || VARIANTS['1']
  const [cat, setCat] = useState(d.cats[0])

  return (
    <div className="ex-page ex-dm" style={{ background: d.bg }}>
      <Link to="/services" className="example-back-btn">← Servicios</Link>

      <header className="ex-dm-header" style={{ background: d.headerBg }}>
        <div className="ex-dm-header-inner">
          <div>
            <span className="ex-dm-logo">{d.brand}</span>
            <span className="ex-dm-sub">{d.sub}</span>
          </div>
          <div className="ex-dm-qr-hint">
            <div className="ex-dm-qr-box" style={{ borderColor: d.accent, color: d.accent }}>QR</div>
            <span style={{ color: d.accent }}>Compartir</span>
          </div>
        </div>
      </header>

      <div className="ex-dm-hero-band" style={{ background: d.headerBg }}>
        <span>{d.hours}</span><span>·</span>
        <span>{d.address}</span><span>·</span>
        <span>📞 +506 2234-5678</span>
      </div>

      <div className="ex-dm-cats" style={{ background: d.headerBg }}>
        {d.cats.map(k => (
          <button key={k} className={cat === k ? 'active' : ''} onClick={() => setCat(k)}
            style={cat === k ? { color: d.accent, borderBottomColor: d.accent } : {}}>
            {k}
          </button>
        ))}
      </div>

      <div className="ex-dm-items">
        {(d.menu[cat] || []).map(item => (
          <div key={item.name} className="ex-dm-item" style={{ background: d.headerBg + 'cc' }}>
            <img className="ex-dm-item-img" src={item.img} alt={item.name} loading="lazy" />
            <div className="ex-dm-item-body">
              <div className="ex-dm-item-top">
                <div>
                  <h3>{item.name}</h3>
                  <span className="ex-dm-item-tag" style={{ background: item.tagC + '22', color: item.tagC }}>{item.tag}</span>
                </div>
                <span className="ex-dm-item-price" style={{ color: d.accent }}>{item.price}</span>
              </div>
              <p>{item.desc}</p>
              <div className="ex-dm-item-foot">
                <button style={{ background: d.accent }}>+ Pedir</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="ex-footer">
        <p>© 2025 {d.brand.replace(/^. /, '')} · {d.sub}</p>
      </footer>
    </div>
  )
}
