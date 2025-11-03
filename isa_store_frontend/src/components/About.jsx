import React from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getGoogleMapsUrl, getWazeUrl } from '../config.js'
import GoogleMapsIcon from './icons/GoogleMapsIcon.jsx'
import WazeIcon from './icons/WazeIcon.jsx'
import './About.css'

function About() {
  const { t } = useLanguage()
  
  // Address for maps from context
  const address = t('storeAddress')
  const googleMapsUrl = getGoogleMapsUrl(address)
  const wazeUrl = getWazeUrl(address)
  
  return (
    <div className="about">
      <div className="about-container">
        <h1 className="page-title">{t('aboutTitle')}</h1>
        
        <div className="about-content">
          <div className="about-section">
            <h2>{t('ourStory')}</h2>
            <p>{t('ourStoryText')}</p>
          </div>

          <div className="about-section">
            <h2>{t('ourMission')}</h2>
            <p>{t('ourMissionText')}</p>
          </div>

          <div className="about-section">
            <h2>{t('whatWeOffer')}</h2>
            <ul className="features-list">
              <li>{t('whatWeOfferItem1')}</li>
              <li>{t('whatWeOfferItem2')}</li>
              <li>{t('whatWeOfferItem3')}</li>
              <li>{t('whatWeOfferItem4')}</li>
              <li>{t('whatWeOfferItem5')}</li>
              <li>{t('whatWeOfferItem6')}</li>
            </ul>
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
              <p>{t('contactEmail')}</p>
              <p>{t('contactPhone')}</p>
              <p>{t('contactAddress')}</p>
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
