import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/useLanguage.js'
import { useExchangeRate } from '../hooks/useExchangeRate.js'
import { getApiUrl } from '../config.js'
import './Services.css'

function AccordionSection({ title, icon, children, extra = '', isOpen, onToggle }) {
  return (
    <div className={`svc-acc${isOpen ? ' open' : ''}${extra ? ' ' + extra : ''}`}>
      <button className="svc-acc-head" onClick={onToggle}>
        {icon && <span className="svc-acc-icon">{icon}</span>}
        <span className="svc-acc-title">{title}</span>
        <span className="svc-acc-chevron">›</span>
      </button>
      <div className="svc-acc-body">
        <div className="svc-acc-inner">
          <div className="svc-acc-content">{children}</div>
        </div>
      </div>
    </div>
  )
}

function ExampleLinkPreview({ to, label, color }) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  const show = () => { setMounted(true); setVisible(true) }
  const hide = () => setVisible(false)

  return (
    <span
      className={`ex-link-wrap${visible ? ' hovered' : ''}`}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <Link to={to} className="example-link" style={{ color }}>{label}</Link>
      {mounted && (
        <span className="ex-preview-bubble">
          <span className="ex-preview-frame">
            <iframe
              src={to}
              title={label}
              className="ex-preview-iframe"
              loading="lazy"
            />
          </span>
          <span className="ex-preview-arrow" />
        </span>
      )}
    </span>
  )
}

const SERVICE_KEYS = ['webDev', 'softwareDev', 'ecommerce', 'maintenance']
const SERVICE_ICONS = { webDev: '🌐', softwareDev: '⚙️', ecommerce: '🛒', maintenance: '🔧' }

const PROCESS_STEP_KEYS = ['discover', 'plan', 'build', 'deliver']
const PROCESS_ICONS = { discover: '💬', plan: '📋', build: '🏗️', deliver: '🚀' }

const PRICING_ROW_COUNT = 12
const ADDITIONAL_ROW_COUNT = 8

function crcToUSD(priceStr, rate) {
  if (!rate || !priceStr.includes('₡')) return null

  const suffix = priceStr.includes('/hora') ? '/hora'
    : priceStr.includes('/hr') ? '/hr'
    : priceStr.includes('/año') ? '/año'
    : priceStr.includes('/yr') ? '/yr'
    : ''

  const rangeMatch = priceStr.match(/₡([\d.,]+)\s*–\s*₡([\d.,]+)/)
  if (rangeMatch) {
    const low = Math.round(parseInt(rangeMatch[1].replace(/[.,]/g, ''), 10) / rate)
    const high = Math.round(parseInt(rangeMatch[2].replace(/[.,]/g, ''), 10) / rate)
    return `≈ $${low.toLocaleString()} – $${high.toLocaleString()}${suffix}`
  }

  const plusMatch = priceStr.match(/₡([\d.,]+)\+/)
  if (plusMatch) {
    const val = Math.round(parseInt(plusMatch[1].replace(/[.,]/g, ''), 10) / rate)
    return `≈ $${val.toLocaleString()}+`
  }

  const singleMatch = priceStr.match(/₡([\d.,]+)/)
  if (singleMatch) {
    const val = Math.round(parseInt(singleMatch[1].replace(/[.,]/g, ''), 10) / rate)
    return `≈ $${val.toLocaleString()}${suffix}`
  }

  return null
}

function Services() {
  const { t, language } = useLanguage()
  const usdRate = useExchangeRate()

  const [showAllPricing, setShowAllPricing] = useState(false)
  const [showAllAdditional, setShowAllAdditional] = useState(false)
  const [apiPricing, setApiPricing] = useState(null)
  const [openSections, setOpenSections] = useState(() => {
    try {
      const saved = sessionStorage.getItem('svc_open_sections')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })

  const toggleSection = (id) =>
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      try { sessionStorage.setItem('svc_open_sections', JSON.stringify([...next])) } catch {}
      return next
    })

  useEffect(() => {
    fetch(getApiUrl('/api/service-pricings'))
      .then(r => r.json())
      .then(data => setApiPricing(data))
      .catch(() => setApiPricing(null))
  }, [])

  const whatsappMessage = encodeURIComponent(t('servicesWhatsAppMessage'))
  const whatsappUrl = `https://wa.me/${t('whatsAppPhone')}?text=${whatsappMessage}`

  return (
    <div className="services">
      <div className="services-container">
        <header className="services-hero">
          <h1 className="services-title">{t('servicesTitle')}</h1>
          <p className="services-subtitle">{t('servicesSubtitle')}</p>
        </header>

        <AccordionSection title={t('servicesWhatWeBuild')} icon="🌐" isOpen={openSections.has('what')} onToggle={()=>toggleSection('what')}>
          <div className="services-grid">
            {SERVICE_KEYS.map((key) => (
              <article key={key} className="service-card">
                <span className="service-card-icon">{SERVICE_ICONS[key]}</span>
                <h3>{t(`service_${key}_title`)}</h3>
                <p>{t(`service_${key}_desc`)}</p>
                <hr className="service-card-divider" />
                <ul className="service-card-features">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <li key={n}>{t(`service_${key}_feature${n}`)}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t('servicesPricingTitle')} icon="💰" isOpen={openSections.has('pricing')} onToggle={()=>toggleSection('pricing')}>
          <div className="services-pricing-table-wrap">
            <table className="services-pricing-table">
              <thead>
                <tr>
                  <th>{t('servicePricing_colProject')}</th>
                  <th>{t('servicePricing_colPrice')}</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const source = apiPricing
                    ? (showAllPricing ? apiPricing : apiPricing.slice(0, 3))
                    : Array.from({ length: showAllPricing ? PRICING_ROW_COUNT : 3 }, (_, i) => ({
                        id: i,
                        name: t(`servicePricing_row${i + 1}_name`),
                        price: t(`servicePricing_row${i + 1}_price`),
                        _last: i === PRICING_ROW_COUNT - 1
                      }))
                  return source.map((row, i) => {
                    const name  = apiPricing ? (language === 'es' ? row.name_es : row.name_en) : row.name
                    const price = apiPricing ? row.price : row.price
                    const usd   = crcToUSD(price, usdRate)
                    const isLast = apiPricing
                      ? (!showAllPricing ? false : i === source.length - 1)
                      : row._last
                    return (
                      <tr key={row.id} className={isLast ? 'pricing-row-featured' : ''}>
                        <td>{name}</td>
                        <td className="pricing-price">
                          {price}
                          {usd && <span className="pricing-usd">{usd}</span>}
                        </td>
                      </tr>
                    )
                  })
                })()}
              </tbody>
            </table>
          </div>
          <button
            className="services-pricing-more"
            onClick={() => setShowAllPricing(p => !p)}
          >
            {showAllPricing ? t('servicesPricingShowLess') : t('servicesPricingShowAll')}
            <span className={`pricing-toggle-chevron${showAllPricing ? ' open' : ''}`}>▼</span>
          </button>
          <p className="services-pricing-note">* {t('servicesPricingNote')}</p>
          {usdRate && (
            <p className="services-pricing-note">
              {t('servicesPricingRateNote', { rate: Math.round(usdRate).toLocaleString() })}
            </p>
          )}
        </AccordionSection>

        <AccordionSection title={t('servicesAdditionalTitle')} icon="➕" extra="svc-acc-alt" isOpen={openSections.has('extra')} onToggle={()=>toggleSection('extra')}>
          <div className="services-pricing-table-wrap">
            <table className="services-pricing-table">
              <thead>
                <tr>
                  <th>{t('servicesAdditional_colService')}</th>
                  <th>{t('servicesAdditional_colPrice')}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: showAllAdditional ? ADDITIONAL_ROW_COUNT : 3 }, (_, i) => {
                  const price = t(`servicesAdditional_row${i + 1}_price`)
                  const usd = crcToUSD(price, usdRate)
                  return (
                    <tr key={i}>
                      <td>{t(`servicesAdditional_row${i + 1}_name`)}</td>
                      <td className="pricing-price">
                        {price}
                        {usd && <span className="pricing-usd">{usd}</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <button
            className="services-pricing-more"
            onClick={() => setShowAllAdditional(p => !p)}
          >
            {showAllAdditional ? t('servicesPricingShowLess') : t('servicesPricingShowAll')}
            <span className={`pricing-toggle-chevron${showAllAdditional ? ' open' : ''}`}>▼</span>
          </button>
        </AccordionSection>

        <AccordionSection title={t('servicesHowItWorks')} icon="🚀" isOpen={openSections.has('process')} onToggle={()=>toggleSection('process')}>
          <ol className="services-process">
            {PROCESS_STEP_KEYS.map((key, index) => (
              <li key={key} className="process-step">
                <div className="process-step-header">
                  <span className="process-number">{index + 1}</span>
                  <span className="process-icon">{PROCESS_ICONS[key]}</span>
                </div>
                <div className="process-step-body">
                  <h3>{t(`process_${key}_title`)}</h3>
                  <p>{t(`process_${key}_desc`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </AccordionSection>

        <AccordionSection title={t('examplesTitle')} icon="🎨" isOpen={openSections.has('examples')} onToggle={()=>toggleSection('examples')}>
          <p className="svc-acc-subtitle">{t('examplesSubtitle')}</p>
          <div className="examples-grid">

            {/* Real Estate */}
            <div className="example-card" style={{ '--card-accent': '#3b82f6' }}>
              <div className="example-preview">
                <div className="example-preview-inner">
                  <div className="example-preview-half" style={{ background: 'white' }}>
                    <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', padding: '10px', flexShrink: 0 }}>
                      <div style={{ fontSize: 16, marginBottom: 2 }}>🏠</div>
                      <div style={{ color: 'white', fontSize: 10, fontWeight: 800 }}>Inmobiliaria</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 7 }}>Sitio web de propiedades</div>
                    </div>
                    <div style={{ flex: 1, padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {['#bfdbfe','#93c5fd','#60a5fa'].map((c,i) => (
                          <div key={i} style={{ flex: 1, borderRadius: 5, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                            <div style={{ background: c, height: 38 }} />
                            <div style={{ padding: '2px 3px' }}>
                              <div style={{ fontSize: 6, fontWeight: 700, color: '#1e3a8a' }}>Casa…</div>
                              <div style={{ fontSize: 6, color: '#2563eb' }}>$450K</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[['🏠','1,240+'],['👥','320'],['🏡','5,800']].map(([ic,v]) => (
                          <div key={v} style={{ flex: 1, background: '#eff6ff', borderRadius: 4, padding: '3px 2px', textAlign: 'center' }}>
                            <div style={{ fontSize: 8 }}>{ic}</div>
                            <div style={{ fontSize: 7, fontWeight: 800, color: '#2563eb' }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="example-preview-half">
                    <div className="mock-bar"><span /><span /><span /></div>
                    <div className="mock-realestate">
                      <div className="mock-re-nav"><b>🏠 ImmoXYZ</b><span>Inicio · Propiedades · Contacto</span></div>
                      <div className="mock-re-cards">
                        {[['#60a5fa','Venta','Casa Las Lomas','$450,000'],['#93c5fd','Renta','Depto Reforma','$1,200/m'],['#3b82f6','Venta','Villa Santa Fe','$850,000']].map(([c,badge,name,price])=>(
                          <div className="mock-re-card" key={name}>
                            <div className="mock-re-img" style={{ background: c }}>
                              <span className="mock-re-badge">{badge}</span>
                            </div>
                            <div className="mock-re-name">{name}</div>
                            <div className="mock-re-price">{price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="example-preview-half" style={{ background: '#0a1f1a' }}>
                    <div style={{ background: '#064e3b', height: 22, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                      <b style={{ color: 'white', fontSize: 8 }}>🌿 CasasCR</b>
                      <div style={{ background: '#10b981', borderRadius: 3, padding: '1px 5px', color: 'white', fontSize: 7 }}>Contactar</div>
                    </div>
                    <div style={{ display: 'flex', flex: 1, margin: '4px 6px', borderRadius: 6, overflow: 'hidden', minHeight: 0 }}>
                      <div style={{ background: 'linear-gradient(135deg,#1a5c45,#0d3b2b)', flex: 1 }} />
                      <div style={{ background: '#0d2b22', width: 68, padding: '5px 6px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
                        <div>
                          <div style={{ background: '#10b981', borderRadius: 8, padding: '1px 4px', fontSize: 6, color: 'white', display: 'inline-block', marginBottom: 2 }}>Venta</div>
                          <div style={{ color: 'white', fontSize: 7, fontWeight: 700, lineHeight: 1.2 }}>Casa Escazú</div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 6 }}>📍 San José</div>
                        </div>
                        <div>
                          <div style={{ color: '#10b981', fontSize: 9, fontWeight: 900, marginBottom: 3 }}>₡85M</div>
                          <div style={{ background: '#10b981', borderRadius: 3, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 6 }}>Ver →</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 3, padding: '0 6px 5px', overflow: 'hidden', flexShrink: 0 }}>
                      {[['#1a5c45','₡95M'],['#164a38','₡45M/m'],['#0f3328','₡250M']].map(([c,p],i)=>(
                        <div key={i} style={{ background: '#0d2b22', borderRadius: 4, overflow: 'hidden', flex: 1 }}>
                          <div style={{ background: c, height: 24 }} />
                          <div style={{ padding: '2px 3px', color: '#10b981', fontSize: 7, fontWeight: 700 }}>{p}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="example-info">
                <div className="example-meta">
                  <h3>{t('exRealEstateName')}</h3>
                  <span className="example-badge" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>2 {t('exExamples')}</span>
                </div>
                <p>{t('exRealEstateDesc')}</p>
                <div className="example-links">
                  <ExampleLinkPreview to="/example/real-estate/1" label={`${t('exExample')} 1 ›`} color="#3b82f6" />
                  <ExampleLinkPreview to="/example/real-estate/2" label={`${t('exExample')} 2 ›`} color="#3b82f6" />
                </div>
              </div>
            </div>

            {/* Restaurant */}
            <div className="example-card" style={{ '--card-accent': '#f59e0b' }}>
              <div className="example-preview">
                <div className="example-preview-inner">
                  <div className="example-preview-half" style={{ background: 'white' }}>
                    <div style={{ background: 'linear-gradient(135deg,#1c0a00,#b45309)', padding: '10px', flexShrink: 0 }}>
                      <div style={{ fontSize: 16, marginBottom: 2 }}>🍽</div>
                      <div style={{ color: 'white', fontSize: 10, fontWeight: 800 }}>Restaurante</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 7 }}>Sitio web con menú y reservas</div>
                    </div>
                    <div style={{ flex: 1, padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ background: '#fef3c7', borderRadius: 5, padding: '5px 6px' }}>
                        <div style={{ fontSize: 7, fontWeight: 800, color: '#1c0a00' }}>Reservar Mesa</div>
                        <div style={{ fontSize: 6, color: '#78350f' }}>Selecciona fecha y hora</div>
                      </div>
                      {[['#fbbf24','Ensalada César','$8.99'],['#f97316','Filete Mignon','$24.99'],['#d97706','Pasta Carbonara','$12.99']].map(([c,name,price]) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 24, height: 24, background: c, borderRadius: 4, flexShrink: 0 }} />
                          <div style={{ flex: 1, fontSize: 6, fontWeight: 600, color: '#1c0a00' }}>{name}</div>
                          <div style={{ fontSize: 6, fontWeight: 700, color: '#b45309' }}>{price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="example-preview-half">
                    <div className="mock-bar"><span /><span /><span /></div>
                    <div className="mock-restaurant">
                      <div className="mock-rest-hero">
                        <div className="mock-rest-hero-text"><b>Restaurante El Sabor</b><small>Reservar Mesa</small></div>
                      </div>
                      <div className="mock-rest-items">
                        {[['#fbbf24','Ensalada César','$8.99'],['#f97316','Filete Mignon','$24.99'],['#d97706','Pasta Carbonara','$12.99']].map(([c,name,price])=>(
                          <div className="mock-rest-item" key={name}>
                            <div className="mock-rest-img" style={{ background: c }} />
                            <div className="mock-rest-name">{name}</div>
                            <div className="mock-rest-price">{price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="example-preview-half" style={{ background: '#fff8f0' }}>
                    <div style={{ background: '#7f1d1d', height: 22, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                      <b style={{ color: 'white', fontSize: 8 }}>LA TAQUERÍA</b>
                      <div style={{ background: '#dc2626', borderRadius: 3, padding: '1px 5px', color: 'white', fontSize: 7 }}>🛒 0</div>
                    </div>
                    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
                      <div style={{ background: '#7f1d1d', width: 52, padding: '4px 3px', display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                        {['Tacos','Platos','Antojitos','Bebidas'].map((c,i)=>(
                          <div key={c} style={{ background: i===0 ? '#dc2626' : 'rgba(255,255,255,0.1)', borderRadius: 3, padding: '2px 3px', color: 'white', fontSize: 6, textAlign: 'center' }}>{c}</div>
                        ))}
                      </div>
                      <div style={{ flex: 1, padding: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, overflow: 'hidden' }}>
                        {['#fbbf24','#f97316','#d97706','#ef4444'].map((c,i)=>(
                          <div key={i} style={{ background: 'white', borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <div style={{ background: c, height: 30 }} />
                            <div style={{ padding: '2px 3px' }}>
                              <div style={{ fontSize: 6, fontWeight: 700, color: '#1a0505' }}>Taco…</div>
                              <div style={{ fontSize: 6, color: '#dc2626', fontWeight: 700 }}>$6.50</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="example-info">
                <div className="example-meta">
                  <h3>{t('exRestaurantName')}</h3>
                  <span className="example-badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#d97706' }}>2 {t('exExamples')}</span>
                </div>
                <p>{t('exRestaurantDesc')}</p>
                <div className="example-links">
                  <ExampleLinkPreview to="/example/restaurant/1" label={`${t('exExample')} 1 ›`} color="#d97706" />
                  <ExampleLinkPreview to="/example/restaurant/2" label={`${t('exExample')} 2 ›`} color="#d97706" />
                </div>
              </div>
            </div>

            {/* Digital Menu */}
            <div className="example-card" style={{ '--card-accent': '#10b981' }}>
              <div className="example-preview">
                <div className="example-preview-inner">
                  <div className="example-preview-half" style={{ background: '#0f172a' }}>
                    <div style={{ background: '#1e293b', padding: '10px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 16, marginBottom: 2 }}>📱</div>
                        <div style={{ color: 'white', fontSize: 10, fontWeight: 800 }}>Menú Digital QR</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 7 }}>Escanea y ordena</div>
                      </div>
                      <div style={{ border: '2px solid #10b981', borderRadius: 4, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: 8, fontWeight: 700 }}>QR</div>
                    </div>
                    <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {['☕ Cafés','🥗 Ensaladas','🥪','🍰'].map((t,i) => (
                          <div key={t} style={{ fontSize: 6, padding: '2px 4px', borderRadius: 10, background: i===0 ? '#10b981' : 'rgba(255,255,255,0.08)', color: i===0 ? 'white' : 'rgba(255,255,255,0.5)' }}>{t}</div>
                        ))}
                      </div>
                      {[['#6ee7b7','Cappuccino','₡2,800','Popular'],['#34d399','Matcha Latte','₡3,200','Nuevo'],['#10b981','Cold Brew','₡3,000','Sin azúcar']].map(([c,name,price,tag]) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, padding: '3px 4px' }}>
                          <div style={{ width: 20, height: 20, background: c, borderRadius: 3, flexShrink: 0 }} />
                          <div style={{ flex: 1, fontSize: 6, color: 'white', fontWeight: 600 }}>{name}</div>
                          <div style={{ fontSize: 6, color: '#10b981', fontWeight: 700 }}>{price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="example-preview-half">
                    <div className="mock-bar"><span /><span /><span /></div>
                    <div className="mock-dmenu">
                      <div className="mock-dm-header"><b>🍽 Menú Digital</b><small>Escaneá el QR</small></div>
                      <div className="mock-dm-tabs">
                        {['Entradas','Principales','Postres','Bebidas'].map((t,i)=>(
                          <span key={t} className={`mock-dm-tab${i===0?' active':''}`}>{t}</span>
                        ))}
                      </div>
                      <div className="mock-dm-items">
                        {[['#6ee7b7','Cóctel Tropical','$5.00'],['#34d399','Bruschettas','$7.50'],['#10b981','Sopa del Día','$4.50'],['#059669','Tabla Mixta','$18.00']].map(([c,name,price])=>(
                          <div className="mock-dm-item" key={name}>
                            <div className="mock-dm-dot" style={{ background: c }} />
                            <span className="mock-dm-iname">{name}</span>
                            <span className="mock-dm-iprice">{price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="example-preview-half" style={{ background: '#faf7f2' }}>
                    <div style={{ background: '#2d1b0e', height: 22, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                      <b style={{ color: 'white', fontSize: 8 }}>🔥 El Asador</b>
                      <div style={{ border: '1px solid rgba(239,68,68,0.5)', borderRadius: 3, padding: '1px 5px', color: '#ef4444', fontSize: 7 }}>QR</div>
                    </div>
                    <div style={{ background: 'white', padding: '3px 6px', display: 'flex', gap: 3, flexShrink: 0, borderBottom: '1px solid #f0ebe3' }}>
                      {['🥩 Carnes','🌽 Lados','🥗','🍺'].map((c,i)=>(
                        <div key={i} style={{ fontSize: 7, padding: '2px 4px', borderRadius: 10, background: i===0 ? 'rgba(239,68,68,0.1)' : 'transparent', color: i===0 ? '#ef4444' : '#888', fontWeight: i===0 ? 700 : 400 }}>{c}</div>
                      ))}
                    </div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 4, overflow: 'hidden' }}>
                      {['#b91c1c','#dc2626','#7f1d1d','#ef4444'].map((c,i)=>(
                        <div key={i} style={{ background: 'white', borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                          <div style={{ height: 32, background: c, position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(245,158,11,0.9)', borderRadius: 6, padding: '1px 3px', fontSize: 5, color: 'white' }}>Popular</div>
                          </div>
                          <div style={{ padding: '2px 3px' }}>
                            <div style={{ fontSize: 6, fontWeight: 700, color: '#1a0a00' }}>Costillas</div>
                            <div style={{ fontSize: 6, color: '#ef4444', fontWeight: 700 }}>₡12,500</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="example-info">
                <div className="example-meta">
                  <h3>{t('exDigitalMenuName')}</h3>
                  <span className="example-badge" style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}>2 {t('exExamples')}</span>
                </div>
                <p>{t('exDigitalMenuDesc')}</p>
                <div className="example-links">
                  <ExampleLinkPreview to="/example/digital-menu/1" label={`${t('exExample')} 1 ›`} color="#059669" />
                  <ExampleLinkPreview to="/example/digital-menu/2" label={`${t('exExample')} 2 ›`} color="#059669" />
                </div>
              </div>
            </div>

            {/* E-commerce */}
            <div className="example-card" style={{ '--card-accent': '#667eea' }}>
              <div className="example-preview">
                <div className="example-preview-inner">
                  <div className="example-preview-half" style={{ background: '#eef2ff' }}>
                    <div style={{ background: 'white', padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderBottom: '1px solid #e0e7ff' }}>
                      <div style={{ fontSize: 9, fontWeight: 800, color: '#4f46e5' }}>🛒 Tienda Online</div>
                      <div style={{ background: '#4f46e5', borderRadius: 4, padding: '1px 6px', color: 'white', fontSize: 7 }}>Carrito 0</div>
                    </div>
                    <div style={{ display: 'flex', gap: 3, padding: '4px 6px', flexShrink: 0 }}>
                      {['Todos','Electrónica','Moda','Bolsos'].map((c,i) => (
                        <div key={c} style={{ fontSize: 6, padding: '1px 4px', borderRadius: 8, background: i===0 ? '#4f46e5' : 'white', color: i===0 ? 'white' : '#6b7280', border: i===0 ? 'none' : '1px solid #e5e7eb' }}>{c}</div>
                      ))}
                    </div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: '0 6px 6px', overflow: 'hidden' }}>
                      {[['#a78bfa','Audífonos','₡89,000'],['#818cf8','Monitor','₡295,000'],['#6366f1','Teclado','₡68,000'],['#7c3aed','Mochila','₡35,000']].map(([c,name,price]) => (
                        <div key={name} style={{ background: 'white', borderRadius: 5, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                          <div style={{ height: 34, background: c }} />
                          <div style={{ padding: '2px 3px' }}>
                            <div style={{ fontSize: 6, fontWeight: 600, color: '#111' }}>{name}</div>
                            <div style={{ fontSize: 6, color: '#4f46e5', fontWeight: 700 }}>{price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="example-preview-half">
                    <div className="mock-bar"><span /><span /><span /></div>
                    <div className="mock-ecommerce">
                      <div className="mock-ec-nav"><b>ShopXYZ</b><span>🛒 Carrito (3)</span></div>
                      <div className="mock-ec-grid">
                        {[['#a78bfa','Audífonos Pro','₡35,000'],['#818cf8','Laptop Stand','₡12,000'],['#6366f1','Cable USB-C','₡4,500'],['#7c3aed','Mochila','₡28,000']].map(([c,name,price])=>(
                          <div className="mock-ec-card" key={name}>
                            <div className="mock-ec-img" style={{ background: c }} />
                            <div className="mock-ec-name">{name}</div>
                            <div className="mock-ec-price">{price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="example-preview-half" style={{ background: '#0f0a14' }}>
                    <div style={{ background: '#1a0d1f', height: 22, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                      <b style={{ color: 'white', fontSize: 8 }}>👗 ModaShop</b>
                      <div style={{ background: '#be185d', borderRadius: 3, padding: '1px 5px', color: 'white', fontSize: 7 }}>🛒 2</div>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg,#be185d,#7c3aed)', padding: '5px 8px', flexShrink: 0 }}>
                      <div style={{ color: 'white', fontSize: 9, fontWeight: 900 }}>Nueva Colección</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 7 }}>Moda · Primavera 2025</div>
                      <div style={{ display: 'flex', gap: 3, marginTop: 3 }}>
                        <div style={{ background: 'white', borderRadius: 3, padding: '1px 6px', color: '#be185d', fontSize: 6, fontWeight: 700 }}>Ver →</div>
                        <div style={{ border: '1px solid white', borderRadius: 3, padding: '1px 6px', color: 'white', fontSize: 6 }}>Nuevo</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flex: 1, gap: 3, padding: '4px', overflow: 'hidden', minHeight: 0 }}>
                      <div style={{ background: 'linear-gradient(135deg,#4a1942,#be185d)', flex: 1.4, borderRadius: 5, position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: 4, left: 4 }}>
                          <div style={{ color: 'white', fontSize: 7, fontWeight: 700 }}>Vestido</div>
                          <div style={{ color: '#f9a8d4', fontSize: 7 }}>₡38,000</div>
                        </div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <div style={{ background: 'linear-gradient(135deg,#5b21b6,#7c3aed)', flex: 1, borderRadius: 5 }} />
                        <div style={{ background: 'linear-gradient(135deg,#831843,#be185d)', flex: 1, borderRadius: 5 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="example-info">
                <div className="example-meta">
                  <h3>{t('exEcommerceName')}</h3>
                  <span className="example-badge" style={{ background: 'rgba(102,126,234,0.12)', color: '#667eea' }}>2 {t('exExamples')}</span>
                </div>
                <p>{t('exEcommerceDesc')}</p>
                <div className="example-links">
                  <ExampleLinkPreview to="/example/ecommerce/1" label={`${t('exExample')} 1 ›`} color="#667eea" />
                  <ExampleLinkPreview to="/example/ecommerce/2" label={`${t('exExample')} 2 ›`} color="#667eea" />
                </div>
              </div>
            </div>

            {/* Management System */}
            <div className="example-card" style={{ '--card-accent': '#8b5cf6' }}>
              <div className="example-preview">
                <div className="example-preview-inner">
                  <div className="example-preview-half" style={{ background: '#f5f3ff' }}>
                    <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#4c1d95)', padding: '8px 10px', flexShrink: 0 }}>
                      <div style={{ fontSize: 14, marginBottom: 2 }}>⚙</div>
                      <div style={{ color: 'white', fontSize: 10, fontWeight: 800 }}>Sistema de Gestión</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 7 }}>Panel administrativo web</div>
                    </div>
                    <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                        {[['#7c3aed','💰','$12,400'],['#6d28d9','📦','84'],['#4f46e5','👤','37'],['#7c3aed','🔄','94%']].map(([c,ic,v]) => (
                          <div key={v} style={{ background: 'white', borderRadius: 4, padding: '3px 4px', borderTop: `2px solid ${c}` }}>
                            <div style={{ fontSize: 8 }}>{ic}</div>
                            <div style={{ fontSize: 8, fontWeight: 800, color: '#1e1b4b' }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: 'white', borderRadius: 4, padding: '4px', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: '100%' }}>
                          {[40,65,50,80,55,90,70].map((h,i) => (
                            <div key={i} style={{ flex: 1, height: `${h}%`, background: i===5 ? '#7c3aed' : '#ddd6fe', borderRadius: '2px 2px 0 0' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="example-preview-half">
                    <div className="mock-bar"><span /><span /><span /></div>
                    <div className="mock-mgmt">
                      <div className="mock-mg-nav"><b>⚙ AdminPanel</b><span>Dashboard</span></div>
                      <div className="mock-mg-kpis">
                        {[['#8b5cf6','Ventas','$12,400'],['#a78bfa','Usuarios','1,240'],['#6d28d9','Pedidos','84'],['#7c3aed','Ingresos','$3,200']].map(([c,label,val])=>(
                          <div className="mock-mg-kpi" key={label} style={{ borderTop: `3px solid ${c}` }}>
                            <div className="mock-mg-kval">{val}</div>
                            <div className="mock-mg-klabel">{label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mock-mg-chart">
                        {[40,65,50,80,55,90,70].map((h,i)=>(
                          <div key={i} className="mock-mg-bar" style={{ height: `${h}%`, background: i===5?'#8b5cf6':'#ddd8fe' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="example-preview-half" style={{ background: '#f0f7ff' }}>
                    <div style={{ background: 'white', height: 26, padding: '0 8px', display: 'flex', alignItems: 'center', gap: 5, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', flexShrink: 0 }}>
                      <b style={{ color: '#0369a1', fontSize: 8 }}>🏥 ClinicPro</b>
                      <div style={{ display: 'flex', gap: 2, flex: 1 }}>
                        {['Dashboard','Citas','Pacientes'].map((n,i)=>(
                          <div key={n} style={{ fontSize: 6, padding: '1px 3px', borderRadius: 3, background: i===0 ? 'rgba(3,105,161,0.1)' : 'transparent', color: i===0 ? '#0369a1' : '#888' }}>{n}</div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 2, padding: '4px', flexShrink: 0 }}>
                      {[['📅','24'],['👤','312'],['⭐','98%']].map(([ic,v])=>(
                        <div key={v} style={{ background: 'white', borderRadius: 4, padding: '2px 4px', display: 'flex', alignItems: 'center', gap: 2, flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                          <span style={{ fontSize: 8 }}>{ic}</span>
                          <b style={{ fontSize: 7, color: '#0f172a' }}>{v}</b>
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, background: 'white', margin: '0 4px 4px', borderRadius: 6, overflow: 'hidden' }}>
                      {[['08:00','Roberto M.','Cardio','#059669'],['09:00','Luisa J.','General','#3b82f6'],['10:00','Pedro A.','Pediatría','#d97706'],['11:00','Carmen V.','Derma','#059669']].map(([time,name,spec,color])=>(
                        <div key={time} style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', minHeight: 26, alignItems: 'center' }}>
                          <div style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 6, color: '#94a3b8', borderRight: '1px solid #f1f5f9', alignSelf: 'stretch', background: '#fafbfc' }}>{time}</div>
                          <div style={{ flex: 1, padding: '3px 4px' }}>
                            <div style={{ borderRadius: 3, padding: '2px 4px', background: color+'22', borderLeft: `2px solid ${color}` }}>
                              <div style={{ fontSize: 6, fontWeight: 700, color: '#0f172a' }}>{name}</div>
                              <div style={{ fontSize: 5, color: '#64748b' }}>{spec}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="example-info">
                <div className="example-meta">
                  <h3>{t('exManagementName')}</h3>
                  <span className="example-badge" style={{ background: 'rgba(139,92,246,0.12)', color: '#7c3aed' }}>2 {t('exExamples')}</span>
                </div>
                <p>{t('exManagementDesc')}</p>
                <div className="example-links">
                  <ExampleLinkPreview to="/example/management/1" label={`${t('exExample')} 1 ›`} color="#7c3aed" />
                  <ExampleLinkPreview to="/example/management/2" label={`${t('exExample')} 2 ›`} color="#7c3aed" />
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div className="example-card" style={{ '--card-accent': '#ec4899' }}>
              <div className="example-preview">
                <div className="example-preview-inner">
                  <div className="example-preview-half" style={{ background: 'white' }}>
                    <div style={{ background: 'linear-gradient(135deg,#fdf2f8,#faf5ff)', padding: '8px 10px', flexShrink: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 8, fontWeight: 800, color: '#ec4899' }}>Portfolio</div>
                          <div style={{ fontSize: 6, color: '#9ca3af' }}>Diseñadora · San José, CR</div>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)', borderRadius: 4, padding: '2px 6px', color: 'white', fontSize: 6, fontWeight: 700 }}>Contrátame</div>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, padding: '5px', overflow: 'hidden' }}>
                      <div style={{ background: 'linear-gradient(135deg,#f9a8d4,#ec4899)', borderRadius: 5, gridRow: 'span 2', position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: 4, left: 4 }}>
                          <div style={{ color: 'white', fontSize: 6, fontWeight: 700 }}>Marca XYZ</div>
                          <div style={{ fontSize: 5, color: 'rgba(255,255,255,0.7)' }}>React · Figma</div>
                        </div>
                      </div>
                      <div style={{ background: 'linear-gradient(135deg,#fda4af,#fb7185)', borderRadius: 5, position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: 2, left: 3, color: 'white', fontSize: 5 }}>App Móvil</div>
                      </div>
                      <div style={{ background: 'linear-gradient(135deg,#c084fc,#a855f7)', borderRadius: 5, position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: 2, left: 3, color: 'white', fontSize: 5 }}>Dashboard</div>
                      </div>
                    </div>
                  </div>
                  <div className="example-preview-half">
                    <div className="mock-bar"><span /><span /><span /></div>
                    <div className="mock-portfolio">
                      <div className="mock-pf-nav"><b>Jane Doe</b><span>Portfolio · CV · Contacto</span></div>
                      <div className="mock-pf-grid">
                        <div className="mock-pf-tile large" style={{ background: 'linear-gradient(135deg,#f9a8d4,#ec4899)' }}><span>Marca XYZ</span></div>
                        <div className="mock-pf-tile" style={{ background: 'linear-gradient(135deg,#fda4af,#fb7185)' }}><span>App Móvil</span></div>
                        <div className="mock-pf-tile" style={{ background: 'linear-gradient(135deg,#c084fc,#a855f7)' }}><span>Web Design</span></div>
                        <div className="mock-pf-tile large-h" style={{ background: 'linear-gradient(135deg,#67e8f9,#06b6d4)' }}><span>E-commerce</span></div>
                        <div className="mock-pf-tile" style={{ background: 'linear-gradient(135deg,#6ee7b7,#10b981)' }}><span>Dashboard</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="example-preview-half" style={{ background: '#090909' }}>
                    <div style={{ background: 'rgba(0,0,0,0.6)', height: 22, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                      <b style={{ color: 'white', fontSize: 8 }}>Andrés Silva</b>
                      <div style={{ background: '#f59e0b', borderRadius: 3, padding: '1px 5px', color: '#0a0a0a', fontSize: 7, fontWeight: 700 }}>Reservar</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      {[['linear-gradient(135deg,#1a0f00,#7c5c2a)','Boda en Tamarindo',50],['linear-gradient(135deg,#0f1a2e,#1e3a5f)','Retrato Corp.',38],['linear-gradient(135deg,#0a1a0a,#1a4a1a)','Paisaje Costero',50],['linear-gradient(135deg,#1a0a0a,#4a1a1a)','Evento',50]].map(([bg,title,h],i)=>(
                        <div key={i} style={{ background: bg, height: h, position: 'relative', flexShrink: 0 }}>
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.7))', padding: '3px 6px', textAlign: i%2===1 ? 'right' : 'left' }}>
                            <div style={{ color: 'white', fontSize: 7, fontWeight: 700 }}>{title}</div>
                            <div style={{ color: '#f59e0b', fontSize: 6 }}>Ver →</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="example-info">
                <div className="example-meta">
                  <h3>{t('exPortfolioName')}</h3>
                  <span className="example-badge" style={{ background: 'rgba(236,72,153,0.12)', color: '#ec4899' }}>2 {t('exExamples')}</span>
                </div>
                <p>{t('exPortfolioDesc')}</p>
                <div className="example-links">
                  <ExampleLinkPreview to="/example/portfolio/1" label={`${t('exExample')} 1 ›`} color="#ec4899" />
                  <ExampleLinkPreview to="/example/portfolio/2" label={`${t('exExample')} 2 ›`} color="#ec4899" />
                </div>
              </div>
            </div>

          </div>
        </AccordionSection>

        <section className="services-section services-cta-section">
          <h2>{t('servicesGetStarted')}</h2>
          <p>{t('servicesGetStartedText')}</p>
          <div className="services-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="services-btn services-btn-whatsapp"
            >
              {t('servicesRequestQuote')}
            </a>
            <a
              href="https://isabelarodriguezr.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="services-btn services-btn-portfolio"
            >
              {t('servicesViewPortfolio')}
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Services
