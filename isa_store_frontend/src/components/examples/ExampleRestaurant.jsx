import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './ExamplePage.css'
import './ExampleRestaurant.css'

const U = (id, w = 110, h = 110) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`

const VARIANTS = {
  '1': {
    brand: 'RISTORANTE', brandSub: 'Bella Vita',
    city: 'San José, Costa Rica · Desde 1998',
    heroGradient: 'linear-gradient(135deg,#1c0a00 0%,#451a03 40%,#78350f 100%)',
    accent: '#b45309',
    tabs: ['Entradas','Principales','Postres','Bebidas'],
    menu: {
      Entradas: [
        { name:'Ensalada César',      desc:'Lechuga romana, croutones, parmesano y aderezo César casero.',         price:'$8.99',  img:U('1546069901-ba9599a7e63c') },
        { name:'Bruschetta Clásica',  desc:'Pan tostado con tomate fresco, albahaca y aceite de oliva.',           price:'$7.50',  img:U('1513104890138-7c749659a591') },
        { name:'Ceviche del Chef',    desc:'Camarón marinado en limón con aguacate y cilantro.',                   price:'$12.00', img:U('1559847865-a2ba3db60225') },
      ],
      Principales: [
        { name:'Filete Mignon',       desc:'Corte de res con salsa de vino tinto, papas rústicas y espárragos.',  price:'$24.99', img:U('1558030006-450675393462') },
        { name:'Pasta Carbonara',     desc:'Spaghetti cremoso con huevo, queso pecorino y panceta.',              price:'$12.99', img:U('1621996346565-e3dbc646d9a9') },
        { name:'Salmón a la Plancha', desc:'Salmón con glaseado de miel y mostaza, risotto de hongos.',           price:'$19.99', img:U('1519708227418-a2d4cdaab2e3') },
      ],
      Postres: [
        { name:'Tiramisú Clásico',    desc:'Bizcocho en café y crema de mascarpone con cacao en polvo.',          price:'$6.99',  img:U('1551024601-bec78aea704b') },
        { name:'Tarta de Chocolate',  desc:'Ganache de chocolate 70% con helado de vainilla artesanal.',          price:'$7.50',  img:U('1464305795204-6f5bbfa316fb') },
        { name:'Panna Cotta',         desc:'Crema italiana suave con coulis de frutos rojos del bosque.',         price:'$5.99',  img:U('1488477181740-be2d47073d6d') },
      ],
      Bebidas: [
        { name:'Cóctel Tropical',     desc:'Frutas naturales de temporada, sin alcohol.',                         price:'$5.00',  img:U('1550985616-10810f23e559') },
        { name:'Vino de la Casa',     desc:'Copa 150ml, tinto, blanco o rosado, selección del sommelier.',        price:'$8.00',  img:U('1510812431401-41d2bd2722f3') },
        { name:'Limonada Artesanal',  desc:'Limones frescos exprimidos al momento con menta.',                    price:'$3.50',  img:U('1557142046-c704a3adf364') },
      ],
    },
  },
  '2': {
    brand: 'LA TAQUERÍA', brandSub: 'Chapultepec',
    city: 'Ciudad de México · Sabores auténticos desde 2010',
    heroGradient: 'linear-gradient(135deg,#450a0a 0%,#7f1d1d 40%,#b91c1c 100%)',
    accent: '#dc2626',
    tabs: ['Tacos','Platos Fuertes','Antojitos','Bebidas'],
    menu: {
      Tacos: [
        { name:'Tacos al Pastor',     desc:'Carne de cerdo marinada con piña, cilantro, cebolla y salsa verde.', price:'$6.50',  img:U('1565299624946-b28f40a0ae38') },
        { name:'Tacos de Birria',     desc:'Carne de res estofada, queso Oaxaca y consomé para remojar.',        price:'$8.00',  img:U('1504674900247-0877df9cc836') },
        { name:'Tacos de Canasta',    desc:'Clásicos de canasta: papas, frijoles y chicharrón en salsa.',        price:'$4.00',  img:U('1555396273-367ea4eb4db5') },
      ],
      'Platos Fuertes': [
        { name:'Enchiladas Verdes',   desc:'Pollo deshebrado en salsa de tomatillo con crema y queso fresco.',  price:'$11.99', img:U('1572441710154-1a12ad1c6e14') },
        { name:'Chile en Nogada',     desc:'Chile poblano relleno de picadillo con salsa de nuez y granada.',   price:'$18.00', img:U('1490645935967-10de6ba17061') },
        { name:'Mole Negro',          desc:'Pollo en mole negro oaxaqueño de 30 ingredientes con arroz.',       price:'$14.50', img:U('1567620832904-5fc7f7e48d43') },
      ],
      Antojitos: [
        { name:'Guacamole',           desc:'Aguacate fresco con jitomate, cebolla, chile serrano y cilantro.',  price:'$5.50',  img:U('1553361371-9b22f78e8b1d') },
        { name:'Quesadillas',         desc:'Tortilla de maíz con queso Oaxaca, flor de calabaza y epazote.',   price:'$7.00',  img:U('1565299507177-8ac33de59573') },
        { name:'Tostadas de Tinga',   desc:'Tostada crujiente con tinga de pollo, lechuga y pico de gallo.',   price:'$6.00',  img:U('1506354666786-6d33b0eec3ab') },
      ],
      Bebidas: [
        { name:'Agua de Jamaica',     desc:'Flor de Jamaica fresca con azúcar de caña y hielo.',               price:'$2.50',  img:U('1505252585461-5b8fb07849d7') },
        { name:'Michelada',           desc:'Cerveza con limón, salsa inglesa, chile y sal en el borde.',        price:'$5.00',  img:U('1461023058943-07fcbe16d735') },
        { name:'Mezcal Artesanal',    desc:'Mezcal de Oaxaca servido con naranja y sal de chapulín.',           price:'$7.50',  img:U('1512463537218-83d6e3e571dd') },
      ],
    },
  },
}

export default function ExampleRestaurant() {
  const { v = '1' } = useParams()
  const d = VARIANTS[v] || VARIANTS['1']
  const [tab, setTab] = useState(d.tabs[0])
  const d2 = VARIANTS['2']
  const [tab2, setTab2] = useState(d2.tabs[0])

  if (v === '2') {
    return (
      <div className="ex-rest2-page">
        <Link to="/services" className="example-back-btn">← Servicios</Link>

        <header className="ex-rest2-header">
          <span className="ex-rest2-logo">🌮 {d2.brand} <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{d2.brandSub}</em></span>
          <button className="ex-rest2-cart">🛒 0</button>
        </header>

        <div className="ex-rest2-body">
          <aside className="ex-rest2-sidebar">
            <p className="ex-rest2-sidebar-title">Categorías</p>
            {d2.tabs.map(cat => (
              <button
                key={cat}
                className={`ex-rest2-cat-btn${tab2 === cat ? ' active' : ''}`}
                onClick={() => setTab2(cat)}
              >
                {cat}
              </button>
            ))}
          </aside>

          <main className="ex-rest2-main">
            <h2 className="ex-rest2-section-title">{tab2}</h2>
            <div className="ex-rest2-grid">
              {(d2.menu[tab2] || []).map(item => (
                <div key={item.name} className="ex-rest2-card">
                  <img className="ex-rest2-card-img" src={item.img} alt={item.name} loading="lazy" />
                  <div className="ex-rest2-card-body">
                    <span className="ex-rest2-card-tag">{tab2}</span>
                    <h3 className="ex-rest2-card-name">{item.name}</h3>
                    <p className="ex-rest2-card-desc">{item.desc}</p>
                    <div className="ex-rest2-card-foot">
                      <span className="ex-rest2-card-price">{item.price}</span>
                      <button className="ex-rest2-card-add">Agregar +</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        <footer className="ex-footer">
          <p>© 2025 {d2.brand} {d2.brandSub} · {d2.city}</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="ex-page ex-rest">
      <Link to="/services" className="example-back-btn">← Servicios</Link>

      <header className="ex-rest-header">
        <div className="ex-rest-header-inner">
          <span className="ex-rest-logo">
            {d.brand} <em style={{ color: d.accent }}>{d.brandSub}</em>
          </span>
          <nav>
            <a href="#">Menú</a><a href="#">Reservas</a>
            <a href="#">Nosotros</a><a href="#">Contacto</a>
          </nav>
          <button className="ex-rest-reserva" style={{ background: d.accent }}>Reservar Mesa</button>
        </div>
      </header>

      <section className="ex-rest-hero" style={{ background: d.heroGradient }}>
        <div className="ex-rest-hero-overlay">
          <p className="ex-rest-tag">{d.city}</p>
          <h1>{v === '1' ? 'La Experiencia\nGastronómica Perfecta' : 'El Sabor Auténtico\nde México'}</h1>
          <p className="ex-rest-hero-sub">
            {v === '1' ? 'Cocina italiana auténtica, ingredientes frescos y un ambiente inigualable'
                       : 'Recetas tradicionales de la abuela, ingredientes frescos y mucho corazón'}
          </p>
          <div className="ex-rest-hero-btns">
            <button className="ex-rest-btn-primary" style={{ background: d.accent }}>Ver Menú</button>
            <button className="ex-rest-btn-outline">Reservar Mesa</button>
          </div>
        </div>
      </section>

      <section className="ex-rest-features">
        {(v === '1'
          ? [['🌿','Ingredientes frescos','Lo mejor de la temporada'],['👨‍🍳','Cocina de autor','Platos únicos con pasión'],['❤','Hecho con amor','Cada detalle pensado para ti'],['🕯','Ambiente acogedor','Para cualquier ocasión']]
          : [['🌽','100% Mexicano','Recetas de origen, sin fusión'],['🔥','Sabores intensos','Chile, mole y especias reales'],['👨‍👩‍👧','Familiar','El lugar ideal para reunirse'],['🎶','Música en vivo','Los fines de semana']]
        ).map(([ic, t, d]) => (
          <div key={t} className="ex-rest-feat"><span>{ic}</span><b>{t}</b><small>{d}</small></div>
        ))}
      </section>

      <section className="ex-rest-menu-section">
        <h2>— NUESTRO MENÚ —</h2>
        <p className="ex-rest-menu-sub">{v === '1' ? 'Platos destacados' : 'Los clásicos de siempre'}</p>
        <div className="ex-rest-tabs">
          {d.tabs.map(k => (
            <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}
              style={tab === k ? { color: d.accent, borderBottomColor: d.accent } : {}}>
              {k}
            </button>
          ))}
        </div>
        <div className="ex-rest-items">
          {(d.menu[tab] || []).map(item => (
            <div key={item.name} className="ex-rest-item">
              <img className="ex-rest-item-img" src={item.img} alt={item.name} loading="lazy" />
              <div className="ex-rest-item-body">
                <div className="ex-rest-item-head">
                  <h3>{item.name}</h3>
                  <span className="ex-rest-item-price" style={{ color: d.accent }}>{item.price}</span>
                </div>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="ex-footer">
        <p>© 2025 {d.brand} {d.brandSub} · {d.city}</p>
      </footer>
    </div>
  )
}
