import React from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import './Privacy.css'

function Privacy() {
  const { t } = useLanguage()

  return (
    <div className="privacy">
      <div className="privacy-container">
        <h1 className="page-title">{t('privacyTitle')}</h1>

        <div className="privacy-content">
          <div className="privacy-section">
            <p className="last-updated">{t('lastUpdated')}: 1 mayo 2026</p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacyIntroduction')}</h2>
            <p>{t('privacyIntroductionText')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('informationWeCollect')}</h2>
            <p>{t('informationWeCollectDescription')}</p>
            <ul className="info-list">
              <li>{t('infoCollected1')}</li>
              <li>{t('infoCollected2')}</li>
              <li>{t('infoCollected3')}</li>
              <li>{t('infoCollected4')}</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>{t('howWeUseInfo')}</h2>
            <p>{t('howWeUseInfoDescription')}</p>
            <ul className="info-list">
              <li>{t('useInfo1')}</li>
              <li>{t('useInfo2')}</li>
              <li>{t('useInfo3')}</li>
              <li>{t('useInfo4')}</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>{t('dataProtection')}</h2>
            <p>{t('dataProtectionDescription')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('dataRetention')}</h2>
            <p>{t('dataRetentionDescription')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('yourRights')}</h2>
            <p>{t('yourRightsDescription')}</p>
            <ul className="info-list">
              <li>{t('right1')}</li>
              <li>{t('right2')}</li>
              <li>{t('right3')}</li>
              <li>{t('right4')}</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>{t('cookiesTitle')}</h2>
            <p>{t('cookiesDescription')}</p>
            <table className="cookies-table">
              <thead>
                <tr>
                  <th>{t('cookiesTableStorage')}</th>
                  <th>{t('cookiesTablePurpose')}</th>
                  <th>{t('cookiesTableRetention')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('cookieRow1Storage')}</td>
                  <td>{t('cookieRow1Purpose')}</td>
                  <td>{t('cookieRow1Retention')}</td>
                </tr>
                <tr>
                  <td>{t('cookieRow2Storage')}</td>
                  <td>{t('cookieRow2Purpose')}</td>
                  <td>{t('cookieRow2Retention')}</td>
                </tr>
              </tbody>
            </table>
            <p className="cookies-rights">{t('cookiesRights')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('contactPrivacy')}</h2>
            <p>{t('contactPrivacyText')}</p>
            <p><a href={`mailto:${t('storeEmail')}`}>{t('storeEmail')}</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
