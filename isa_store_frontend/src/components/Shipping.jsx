import React from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getGoogleMapsUrl, getWazeUrl } from '../config.js'
import GoogleMapsIcon from './icons/GoogleMapsIcon.jsx'
import WazeIcon from './icons/WazeIcon.jsx'
import './Shipping.css'

function Shipping() {
  const { t } = useLanguage()
  
  // Address for maps from context
  const address = t('storeAddress')
  const googleMapsUrl = getGoogleMapsUrl(address)
  const wazeUrl = getWazeUrl(address)
  
  return (
    <div className="shipping">
      <div className="shipping-container">
        <h1 className="page-title">{t('shippingTitle')}</h1>
        
        <div className="shipping-content">
          <div className="shipping-section">
            <h2>{t('shippingMethods')}</h2>
            <p>{t('shippingMethodsDescription')}</p>
            <ul className="info-list">
              <li>{t('shippingMethod1')}</li>
              <li>{t('shippingMethod2')}</li>
              <li>{t('pickupOption')}</li>
            </ul>
          </div>

          <div className="shipping-section">
            <h2>{t('pickupTitle')}</h2>
            <p>{t('pickupDescription')}</p>
            <p className="pickup-location">
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">{t('contactAddress')}</a>
            </p>
            <div className="shipping-map-buttons">
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="shipping-map-link"
                title={t('openInGoogleMaps')}
              >
                <GoogleMapsIcon size={24} />
                <span>{t('openInGoogleMaps')}</span>
              </a>
              <a 
                href={wazeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="shipping-map-link"
                title={t('openInWaze')}
              >
                <WazeIcon size={24} />
                <span>{t('openInWaze')}</span>
              </a>
            </div>
          </div>

          <div className="shipping-section">
            <h2>{t('paymentMethods')}</h2>
            <p>{t('paymentMethodsDescription')}</p>
            <ul className="info-list">
              <li>{t('paymentMethod1')}</li>
              <li>{t('paymentMethod2')}</li>
              <li>{t('paymentMethod3')}</li>
            </ul>
            <p className="important-note">{t('paymentNote')}</p>
          </div>

          <div className="shipping-section">
            <h2>{t('warranty')}</h2>
            <p>{t('warrantyDescription')}</p>
            <ul className="info-list">
              <li>{t('warrantyUsed')}</li>
              <li>{t('warrantyNew')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shipping

