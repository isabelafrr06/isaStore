import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/useLanguage.js'
import { useCategories } from '../contexts/CategoriesContext.jsx'
import { getGoogleMapsUrl, getWazeUrl } from '../config.js'
import GoogleMapsIcon from './icons/GoogleMapsIcon.jsx'
import WazeIcon from './icons/WazeIcon.jsx'
import './About.css'

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

const BENEFITS = [
  { key: 'fastShipping',      textKey: 'fastShippingText' },
  { key: 'qualityGuarantee',  textKey: 'qualityGuaranteeText' },
  { key: 'support247',        textKey: 'support247Text' },
  { key: 'bestPrices',        textKey: 'bestPricesText' },
]

function About() {
  const { t, language } = useLanguage()
  const categories = useCategories()
  const [openSections, setOpenSections] = useState(new Set())

  const toggle = (id) => setOpenSections(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const address = t('storeAddress')
  const googleMapsUrl = getGoogleMapsUrl(address)
  const wazeUrl = getWazeUrl(address)

  return (
    <div className="about">
      <div className="about-container">

        <header className="about-hero">
          <h1 className="about-title">{t('aboutTitle')}</h1>
        </header>

        <div className="about-content">

          <AccordionSection title={t('ourMission')} icon="🎯"
            isOpen={openSections.has('mission')} onToggle={() => toggle('mission')}>
            <p>{t('ourMissionText')}</p>
          </AccordionSection>

          <AccordionSection title={t('whatWeOffer')} icon="🛍️"
            isOpen={openSections.has('offer')} onToggle={() => toggle('offer')}>
            {categories.length > 0 && (
              <div className="categories-grid">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/?category=${encodeURIComponent(category.name || category.name_en)}`}
                    className="category-card"
                  >
                    {language === 'es' ? category.name_es : category.name_en}
                  </Link>
                ))}
              </div>
            )}
            <div className="about-services-promo">
              <p>{t('aboutServicesText')}</p>
              <Link to="/services" className="about-services-link">
                {t('servicesPromoCta')} →
              </Link>
            </div>
          </AccordionSection>

          <AccordionSection title={t('whyChooseUs')} icon="⭐"
            isOpen={openSections.has('why')} onToggle={() => toggle('why')}>
            <div className="benefits-grid">
              {BENEFITS.map(({ key, textKey }) => (
                <div key={key} className="benefit-card">
                  <h3>{t(key)}</h3>
                  <p>{t(textKey)}</p>
                </div>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection title={t('contactUs')} icon="📞"
            isOpen={openSections.has('contact')} onToggle={() => toggle('contact')}>
            <p className="about-contact-intro">{t('contactUsText')}</p>
            <div className="contact-list">
              <div className="contact-item">
                <span className="contact-label">{t('email')}</span>
                <a href={`mailto:${t('storeEmail')}`}>{t('storeEmail')}</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t('phone')}</span>
                <a href={`tel:${t('storePhone').replace(/\s/g, '')}`}>{t('storePhone')}</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t('address')}</span>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">{t('storeAddress')}</a>
              </div>
            </div>
            <div className="about-map-buttons">
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="about-map-button google-maps-btn">
                <GoogleMapsIcon size={18} />
                <span>{t('openInGoogleMaps')}</span>
              </a>
              <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className="about-map-button waze-btn">
                <WazeIcon size={18} />
                <span>{t('openInWaze')}</span>
              </a>
            </div>
          </AccordionSection>

        </div>
      </div>
    </div>
  )
}

export default About
