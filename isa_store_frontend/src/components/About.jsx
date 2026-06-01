import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/useLanguage.js'
import { useCategories } from '../contexts/CategoriesContext.jsx'
import { getGoogleMapsUrl, getWazeUrl } from '../config.js'
import GoogleMapsIcon from './icons/GoogleMapsIcon.jsx'
import WazeIcon from './icons/WazeIcon.jsx'
import './About.css'

const BENEFITS = [
  { key: 'fastShipping',      textKey: 'fastShippingText' },
  { key: 'qualityGuarantee',  textKey: 'qualityGuaranteeText' },
  { key: 'support247',        textKey: 'support247Text' },
  { key: 'bestPrices',        textKey: 'bestPricesText' },
]

function About() {
  const { t, language } = useLanguage()
  const categories = useCategories()

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

          <div className="about-section">
            <h2 className="about-section-title">{t('ourMission')}</h2>
            <p>{t('ourMissionText')}</p>
          </div>

          <div className="about-section about-services-section">
            <div className="about-services-body">
              <h2 className="about-section-title">{t('services')}</h2>
              <p>{t('aboutServicesText')}</p>
            </div>
            <Link to="/services" className="about-services-link">
              {t('servicesPromoCta')} →
            </Link>
          </div>

          <div className="about-section">
            <h2 className="about-section-title">{t('whatWeOffer')}</h2>
            {categories.length > 0 ? (
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
            ) : (
              <p>{t('noCategories')}</p>
            )}
          </div>

          <div className="about-section">
            <h2 className="about-section-title">{t('whyChooseUs')}</h2>
            <div className="benefits-grid">
              {BENEFITS.map(({ key, textKey }) => (
                <div key={key} className="benefit-card">
                  <h3>{t(key)}</h3>
                  <p>{t(textKey)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="about-section">
            <h2 className="about-section-title">{t('contactUs')}</h2>
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
          </div>

        </div>
      </div>
    </div>
  )
}

export default About
