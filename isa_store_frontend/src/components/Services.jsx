import React, { useState } from 'react'
import { useLanguage } from '../contexts/useLanguage.js'
import { useExchangeRate } from '../hooks/useExchangeRate.js'
import './Services.css'

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
  const { t } = useLanguage()
  const usdRate = useExchangeRate()

  const [showAllPricing, setShowAllPricing] = useState(false)
  const [showAllAdditional, setShowAllAdditional] = useState(false)

  const whatsappMessage = encodeURIComponent(t('servicesWhatsAppMessage'))
  const whatsappUrl = `https://wa.me/${t('whatsAppPhone')}?text=${whatsappMessage}`

  return (
    <div className="services">
      <div className="services-container">
        <header className="services-hero">
          <h1 className="services-title">{t('servicesTitle')}</h1>
          <p className="services-subtitle">{t('servicesSubtitle')}</p>
        </header>

        <section className="services-section">
          <h2 className="services-section-title">{t('servicesWhatWeBuild')}</h2>
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
        </section>

        <section className="services-section">
          <h2 className="services-section-title">{t('servicesPricingTitle')}</h2>
          <div className="services-pricing-table-wrap">
            <table className="services-pricing-table">
              <thead>
                <tr>
                  <th>{t('servicePricing_colProject')}</th>
                  <th>{t('servicePricing_colPrice')}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: showAllPricing ? PRICING_ROW_COUNT : 5 }, (_, i) => {
                  const price = t(`servicePricing_row${i + 1}_price`)
                  const usd = crcToUSD(price, usdRate)
                  return (
                    <tr key={i} className={i === PRICING_ROW_COUNT - 1 ? 'pricing-row-featured' : ''}>
                      <td>{t(`servicePricing_row${i + 1}_name`)}</td>
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
        </section>

        <section className="services-section services-additional-section">
          <h2 className="services-section-title">{t('servicesAdditionalTitle')}</h2>
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
        </section>

        <section className="services-section">
          <h2 className="services-section-title">{t('servicesHowItWorks')}</h2>
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
        </section>

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
