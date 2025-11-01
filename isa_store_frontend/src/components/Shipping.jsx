import React from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import './Shipping.css'

function Shipping() {
  const { t } = useLanguage()
  
  return (
    <div className="shipping">
      <div className="shipping-container">
        <h1 className="page-title">{t('shippingTitle')}</h1>
        
        <div className="shipping-content">
          <div className="shipping-section">
            <h2>{t('shippingAreas')}</h2>
            <p>{t('shippingAreasDescription')}</p>
            <ul className="info-list">
              <li>{t('shippingArea1')}</li>
              <li>{t('shippingArea2')}</li>
              <li>{t('shippingArea3')}</li>
            </ul>
          </div>

          <div className="shipping-section">
            <h2>{t('shippingTimes')}</h2>
            <div className="shipping-times">
              <div className="time-card">
                <h3>{t('standardShipping')}</h3>
                <p><strong>{t('duration')}:</strong> 2-4 {t('businessDays')}</p>
                <p><strong>{t('cost')}:</strong> ₡{t('standardShippingCost')}</p>
              </div>
              <div className="time-card">
                <h3>{t('expressShipping')}</h3>
                <p><strong>{t('duration')}:</strong> 1-2 {t('businessDays')}</p>
                <p><strong>{t('cost')}:</strong> ₡{t('expressShippingCost')}</p>
              </div>
            </div>
          </div>

          <div className="shipping-section">
            <h2>{t('freeShipping')}</h2>
            <p>{t('freeShippingDescription')}</p>
          </div>

          <div className="shipping-section">
            <h2>{t('trackingOrder')}</h2>
            <p>{t('trackingOrderDescription')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shipping

