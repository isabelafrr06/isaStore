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
  const [openSections, setOpenSections] = useState(new Set())

  const toggleSection = (id) =>
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
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
