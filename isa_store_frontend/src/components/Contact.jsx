import React from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import './Contact.css'

function Contact() {
  const { t } = useLanguage()
  
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

