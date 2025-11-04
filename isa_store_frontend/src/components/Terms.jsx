import React from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import './Terms.css'

function Terms() {
  const { t } = useLanguage()
  
  return (
    <div className="terms">
      <div className="terms-container">
        <h1 className="page-title">{t('termsTitle')}</h1>
        
        <div className="terms-content">
          <div className="terms-section">
            <p className="last-updated">{t('lastUpdated')}: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="terms-section">
            <h2>{t('termsAcceptance')}</h2>
            <p>{t('termsAcceptanceText')}</p>
          </div>

          <div className="terms-section">
            <h2>{t('useOfService')}</h2>
            <p>{t('useOfServiceDescription')}</p>
            <ul className="info-list">
              <li>{t('useService1')}</li>
              <li>{t('useService2')}</li>
              <li>{t('useService3')}</li>
              <li>{t('useService4')}</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>{t('ordersAndPayment')}</h2>
            <p>{t('ordersAndPaymentDescription')}</p>
          </div>

          <div className="terms-section">
            <h2>{t('productAvailability')}</h2>
            <p>{t('productAvailabilityDescription')}</p>
          </div>

          <div className="terms-section">
            <h2>{t('limitationOfLiability')}</h2>
            <p>{t('limitationOfLiabilityDescription')}</p>
          </div>

          <div className="terms-section">
            <h2>{t('contactTerms')}</h2>
            <p>{t('contactTermsText')}</p>
            <p><a href={`mailto:${t('storeEmail')}`}>{t('storeEmail')}</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms

