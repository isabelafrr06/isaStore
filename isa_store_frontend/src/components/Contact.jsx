import React from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getGoogleMapsUrl, getWazeUrl } from '../config.js'
import GoogleMapsIcon from './icons/GoogleMapsIcon.jsx'
import WazeIcon from './icons/WazeIcon.jsx'
import './Contact.css'

function Contact() {
  const { t } = useLanguage()
  
  // Address for maps from context
  const address = t('storeAddress')
  const googleMapsUrl = getGoogleMapsUrl(address)
  const wazeUrl = getWazeUrl(address)
  
  return (
    <div className="contact">
      <div className="contact-container">
        <h1 className="page-title">{t('contactTitle')}</h1>
        
        <div className="contact-content">
          <div className="contact-section">
            <h2>{t('getInTouch')}</h2>
            <p>{t('contactDescription')}</p>
          </div>

          <div className="contact-info-section">
            <div className="contact-card">
              <h3>📧 {t('email')}</h3>
              <p><a href="mailto:info@isastore.com">info@isastore.com</a></p>
            </div>
            
            <div className="contact-card">
              <h3>📞 {t('phone')}</h3>
              <p><a href="tel:+50683047863">+506 83047863</a></p>
            </div>
            
            <div className="contact-card">
              <h3>📍 {t('address')}</h3>
              <p>{t('contactAddress')}</p>
              <div className="map-buttons">
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="map-button google-maps-btn"
                >
                  <GoogleMapsIcon size={20} />
                  <span>{t('openInGoogleMaps')}</span>
                </a>
                <a 
                  href={wazeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="map-button waze-btn"
                >
                  <WazeIcon size={20} />
                  <span>{t('openInWaze')}</span>
                </a>
              </div>
            </div>
            
            <div className="contact-card">
              <h3>💬 {t('whatsapp')}</h3>
              <a href="https://wa.me/50683047863" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                {t('whatsappUs')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

