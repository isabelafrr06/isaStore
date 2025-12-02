import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl, getGoogleMapsUrl, getWazeUrl } from '../config.js'
import GoogleMapsIcon from './icons/GoogleMapsIcon.jsx'
import WazeIcon from './icons/WazeIcon.jsx'
import './About.css'

function About() {
  const { t, language } = useLanguage()
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  // Address for maps from context
  const address = t('storeAddress')
  const googleMapsUrl = getGoogleMapsUrl(address)
  const wazeUrl = getWazeUrl(address)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = () => {
    fetch(getApiUrl('/api/categories'))
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || [])
        setLoadingCategories(false)
      })
      .catch(err => {
        console.error('Error fetching categories:', err)
        setLoadingCategories(false)
      })
  }
  
  return (
    <div className="about">
      <div className="about-container">
        <h1 className="page-title">{t('aboutTitle')}</h1>
        
        <div className="about-content">
          <div className="about-section">
            <h2>{t('ourMission')}</h2>
            <p>{t('ourMissionText')}</p>
          </div>

          <div className="about-section">
            <h2>{t('whatWeOffer')}</h2>
            {loadingCategories ? (
              <p>{t('loading')}...</p>
            ) : categories.length > 0 ? (
              <div className="categories-grid">
                {categories.map((category) => (
                  <Link 
                    key={category.id} 
                    to={`/?category=${encodeURIComponent(category.name || category.name_en)}`}
                    className="category-card"
                  >
                    <span className="category-icon">📦</span>
                    <span className="category-name">{language === 'es' ? category.name_es : category.name_en}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p>{t('noCategories')}</p>
            )}
          </div>

          <div className="about-section">
            <h2>{t('whyChooseUs')}</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <h3>{t('fastShipping')}</h3>
                <p>{t('fastShippingText')}</p>
              </div>
              <div className="benefit-card">
                <h3>{t('qualityGuarantee')}</h3>
                <p>{t('qualityGuaranteeText')}</p>
              </div>
              <div className="benefit-card">
                <h3>{t('support247')}</h3>
                <p>{t('support247Text')}</p>
              </div>
              <div className="benefit-card">
                <h3>{t('bestPrices')}</h3>
                <p>{t('bestPricesText')}</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>{t('contactUs')}</h2>
            <p>{t('contactUsText')}</p>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">{t('email')}:</span>
                <a href={`mailto:${t('storeEmail')}`}>{t('storeEmail')}</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t('phone')}:</span>
                <a href={`tel:${t('storePhone').replace(/\s/g, '')}`}>{t('storePhone')}</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t('address')}:</span>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">{t('storeAddress')}</a>
              </div>
              <div className="about-map-buttons">
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="about-map-button google-maps-btn"
                >
                  <GoogleMapsIcon size={20} />
                  <span>{t('openInGoogleMaps')}</span>
                </a>
                <a 
                  href={wazeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="about-map-button waze-btn"
                >
                  <WazeIcon size={20} />
                  <span>{t('openInWaze')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
