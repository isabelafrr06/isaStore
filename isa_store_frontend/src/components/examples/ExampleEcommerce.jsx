import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './ExamplePage.css'
import './ExampleEcommerce.css'

const U = (id, w = 300, h = 300) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`

const VARIANTS = {
  '1': {
    brand: '⚡ TechStore', tagline: 'Tecnología al mejor precio',
    accent: '#4f46e5', accentLight: '#eef2ff',
    cats: ['Todos','Electrónicos','Accesorios','Laptops'],
    products: [
      { name:'Audífonos Sony XM5',    price:'₡89,000',  old:'₡105,000', stars:5, cat:'Electrónicos', img:U('1505740420928-5e560c06d30e') },
      { name:'Mouse Logitech MX3',    price:'₡42,000',  old:null,       stars:4, cat:'Accesorios',   img:U('1527443224154-c4a3942d3acf') },
      { name:'Teclado Mecánico RGB',  price:'₡68,000',  old:'₡80,000',  stars:5, cat:'Electrónicos', img:U('1561112078-5d576b37f4da') },
      { name:'Hub USB-C 7 en 1',      price:'₡22,000',  old:null,       stars:4, cat:'Accesorios',   img:U('1558618666-fcd25c85cd64') },
      { name:'Mochila Laptop 15"',    price:'₡35,000',  old:'₡48,000',  stars:5, cat:'Accesorios',   img:U('1553062407-98eeb64c6a62') },
      { name:'Monitor 27" 4K',        price:'₡295,000', old:null,       stars:5, cat:'Electrónicos', img:U('1547082766-7b6e62f00d2c') },
      { name:'Webcam Full HD',        price:'₡28,000',  old:null,       stars:4, cat:'Electrónicos', img:U('1496181133206-80ce9b88a853') },
      { name:'Cable USB-C 2m',        price:'₡4,500',   old:null,       stars:3, cat:'Accesorios',   img:U('1583395838-5fa7c5da3248') },
    ],
  },
  '2': {
    brand: '👗 ModaShop', tagline: 'Moda que te define',
    accent: '#be185d', accentLight: '#fdf2f8',
    cats: ['Todos','Ropa','Zapatos','Bolsos','Accesorios'],
    products: [
      { name:'Vestido Floral Midi',   price:'₡38,000',  old:'₡52,000',  stars:5, cat:'Ropa',         img:U('1539109136881-3be0616acf4b') },
      { name:'Zapatos de Tacón',      price:'₡55,000',  old:null,       stars:4, cat:'Zapatos',       img:U('1542291026-7eec264c27ff') },
      { name:'Bolso de Cuero',        price:'₡72,000',  old:'₡90,000',  stars:5, cat:'Bolsos',        img:U('1548036328-c9fa89d128fa') },
      { name:'Chaqueta Mezclilla',    price:'₡65,000',  old:null,       stars:4, cat:'Ropa',          img:U('1551028719-00167b16eac5') },
      { name:'Pañuelo de Seda',       price:'₡18,000',  old:null,       stars:5, cat:'Accesorios',    img:U('1490481651-0edob3d71d45') },
      { name:'Jeans Skinny',          price:'₡42,000',  old:'₡58,000',  stars:4, cat:'Ropa',          img:U('1582552938357-32b906df40cb') },
      { name:'Sneakers Blancos',      price:'₡48,000',  old:null,       stars:5, cat:'Zapatos',       img:U('1491553895911-0055eca6402d') },
      { name:'Aretes de Perla',       price:'₡15,000',  old:null,       stars:4, cat:'Accesorios',    img:U('1535632066927-ab7c9ab60908') },
    ],
  },
}

export default function ExampleEcommerce() {
  const { v = '1' } = useParams()
  const d = VARIANTS[v] || VARIANTS['1']
  const [cat, setCat] = useState('Todos')
  const [cart, setCart] = useState(0)
  const shown = cat === 'Todos' ? d.products : d.products.filter(p => p.cat === cat)

  // ── Variant 2: dark fashion editorial / lookbook layout ──────────────────
  if (v === '2') {
    const featured = d.products.slice(0, 3)
    const more = d.products.slice(3)
    return (
      <div className="ex-ec2-page">
        <Link to="/services" className="example-back-btn" style={{ position: 'relative', zIndex: 200 }}>← Servicios</Link>

        {/* Sticky header */}
        <header className="ex-ec2-header">
          <span className="ex-ec2-logo">{d.brand}</span>
          <div className="ex-ec2-header-actions">
            <button className="ex-ec2-saved-btn">♡ Guardados</button>
            <button className="ex-ec2-cart-btn" onClick={() => setCart(c => c + 1)}>
              🛒 {cart}
            </button>
          </div>
        </header>

        {/* Hero banner */}
        <div className="ex-ec2-hero">
          <h1>Nueva Colección</h1>
          <p>Moda que te define · Primavera 2025</p>
          <div className="ex-ec2-hero-btns">
            <button className="ex-ec2-hero-btn-main">Ver Colección →</button>
            <button className="ex-ec2-hero-btn-out">Novedades</button>
          </div>
        </div>

        {/* Asymmetric featured section */}
        <p className="ex-ec2-section-title">Looks Destacados</p>
        <div className="ex-ec2-featured">
          {/* Left: tall card — product 0 */}
          <div className="ex-ec2-feat-card tall">
            <img src={featured[0].img} alt={featured[0].name} className="ex-ec2-feat-img" loading="lazy" />
            <div className="ex-ec2-feat-overlay">
              <p className="ex-ec2-feat-name">{featured[0].name}</p>
              <p className="ex-ec2-feat-price">{featured[0].price}</p>
              <button className="ex-ec2-feat-add" onClick={() => setCart(c => c + 1)}>Agregar</button>
            </div>
          </div>

          {/* Right: two stacked short cards — products 1 & 2 */}
          <div className="ex-ec2-feat-right">
            {featured.slice(1).map((p, i) => (
              <div key={i} className="ex-ec2-feat-card short">
                <img src={p.img} alt={p.name} className="ex-ec2-feat-img" loading="lazy" />
                <div className="ex-ec2-feat-overlay">
                  <p className="ex-ec2-feat-name">{p.name}</p>
                  <p className="ex-ec2-feat-price">{p.price}</p>
                  <button className="ex-ec2-feat-add" onClick={() => setCart(c => c + 1)}>Agregar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal scroll strip — remaining 5 products */}
        <div className="ex-ec2-more-strip">
          <p className="ex-ec2-more-title">Más Prendas</p>
          <div className="ex-ec2-scroll">
            {more.map((p, i) => (
              <div key={i} className="ex-ec2-mini">
                <img src={p.img} alt={p.name} className="ex-ec2-mini-img" loading="lazy" />
                <div className="ex-ec2-mini-info">
                  <p className="ex-ec2-mini-name">{p.name}</p>
                  <p className="ex-ec2-mini-price">{p.price}</p>
                  <button className="ex-ec2-mini-add" onClick={() => setCart(c => c + 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Variant 1 (default): light product grid layout ───────────────────────
  return (
    <div className="ex-page ex-ec" style={{ background: d.accentLight }}>
      <Link to="/services" className="example-back-btn">← Servicios</Link>

      <header className="ex-ec-header">
        <div className="ex-ec-header-inner">
          <span className="ex-ec-logo" style={{ color: d.accent }}>{d.brand}</span>
          <div className="ex-ec-search-wrap">
            <input className="ex-ec-search" placeholder="🔍  Buscar productos…"
              style={{ borderColor: d.accent + '44' }} />
          </div>
          <div className="ex-ec-actions">
            <button className="ex-ec-fav" style={{ color: d.accent, borderColor: d.accent + '44', background: d.accentLight }}>♡ Favoritos</button>
            <button className="ex-ec-cart" style={{ background: d.accent }} onClick={() => setCart(c => c + 1)}>
              🛒 Carrito {cart > 0 && <span className="ex-ec-badge">{cart}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="ex-ec-cats">
        {d.cats.map(c => (
          <button key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}
            style={cat === c ? { color: d.accent, borderBottomColor: d.accent } : {}}>
            {c}
          </button>
        ))}
      </div>

      <section className="ex-ec-section">
        <div className="ex-ec-section-head">
          <h2>{cat === 'Todos' ? 'Productos Destacados' : cat}</h2>
          <select className="ex-ec-sort"><option>Más relevantes</option><option>Precio ↑</option><option>Precio ↓</option></select>
        </div>
        <div className="ex-ec-grid">
          {shown.map((p, i) => (
            <div key={i} className="ex-ec-card">
              <div className="ex-ec-img-wrap">
                <img src={p.img} alt={p.name} loading="lazy" className="ex-ec-img-photo" />
                {p.old && <span className="ex-ec-sale" style={{ background: d.accent }}>OFERTA</span>}
                <button className="ex-ec-wish" onClick={() => setCart(c => c + 1)}>♡</button>
              </div>
              <div className="ex-ec-body">
                <p className="ex-ec-name">{p.name}</p>
                <div className="ex-ec-stars">{'★'.repeat(p.stars)}{'☆'.repeat(5 - p.stars)}</div>
                <div className="ex-ec-pricing">
                  <span className="ex-ec-price" style={{ color: d.accent }}>{p.price}</span>
                  {p.old && <span className="ex-ec-old">{p.old}</span>}
                </div>
                <button className="ex-ec-add" style={{ background: d.accent }} onClick={() => setCart(c => c + 1)}>
                  + Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="ex-footer">
        <p>© 2025 {d.brand.replace(/^. /, '')} · {d.tagline}</p>
      </footer>
    </div>
  )
}
