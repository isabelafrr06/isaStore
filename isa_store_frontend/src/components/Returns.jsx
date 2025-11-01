import React from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import './Returns.css'

function Returns() {
  const { t } = useLanguage()
  
  return (
    <div className="returns">
      <div className="returns-container">
        <h1 className="page-title">{t('returnsTitle')}</h1>
        
        <div className="returns-content">
          <div className="returns-section">
            <h2>{t('returnPolicy')}</h2>
            <p>{t('returnPolicyDescription')}</p>
          </div>

          <div className="returns-section">
            <h2>{t('returnPeriod')}</h2>
            <p>{t('returnPeriodDescription')}</p>
          </div>

          <div className="returns-section">
            <h2>{t('returnConditions')}</h2>
            <ul className="info-list">
              <li>{t('returnCondition1')}</li>
              <li>{t('returnCondition2')}</li>
              <li>{t('returnCondition3')}</li>
              <li>{t('returnCondition4')}</li>
            </ul>
          </div>

          <div className="returns-section">
            <h2>{t('howToReturn')}</h2>
            <ol className="steps-list">
              <li>{t('returnStep1')}</li>
              <li>{t('returnStep2')}</li>
              <li>{t('returnStep3')}</li>
              <li>{t('returnStep4')}</li>
            </ol>
          </div>

          <div className="returns-section">
            <h2>{t('refundProcess')}</h2>
            <p>{t('refundProcessDescription')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Returns

