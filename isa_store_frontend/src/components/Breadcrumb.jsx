import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import './Breadcrumb.css'

function Breadcrumb({ admin, onAdminLogout }) {
  const location = useLocation()
  const { t, language, toggleLanguage } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const getBreadcrumbItems = () => {
    const path = location.pathname
    const segments = path.split('/').filter(segment => segment !== '')
    
    const breadcrumbs = [
      { name: t('home'), path: '/', isActive: path === '/' }
    ]
    
    if (segments.length === 0) return breadcrumbs
    
    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      let name = ''
      let isActive = index === segments.length - 1
      
      switch (segment) {
        case 'about':
          name = t('about')
          break
        case 'cart':
          name = t('cart')
          break
        case 'orders':
          name = t('orders')
          break
        case 'admin':
          name = t('adminPanel')
          break
        case 'login':
          name = t('adminLogin')
          break
        case 'product':
          if (segments[index + 1]) {
            name = t('product')
            isActive = true
          } else {
            name = t('products')
          }
          break
        default:
          if (segment.match(/^\d+$/)) {
            name = t('details')
          } else {
            name = segment.charAt(0).toUpperCase() + segment.slice(1)
          }
      }
      
      breadcrumbs.push({
        name,
        path: currentPath,
        isActive
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbItems = getBreadcrumbItems()
  
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <div className="breadcrumb-container">
        <div className="breadcrumb-logo">
          <Link to="/" className="logo-link">
            <h1>IsaStore</h1>
          </Link>
        </div>
        
        <div className="breadcrumb-content">
          <ol className="breadcrumb-list">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="breadcrumb-item">
                {item.isActive ? (
                  <span className="breadcrumb-current" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link to={item.path} className="breadcrumb-link">
                    {item.name}
                  </Link>
                )}
                {index < breadcrumbItems.length - 1 && (
                  <span className="breadcrumb-separator" aria-hidden="true">
                    ›
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
        
        <div className="breadcrumb-actions">
          <button onClick={toggleLanguage} className="language-btn">
            {language === 'es' ? 'EN' : 'ES'}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="menu-toggle"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              {t('home')}
            </Link>
            <Link to="/about" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              {t('about')}
            </Link>
            <Link to="/cart" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              {t('cart')}
            </Link>
            {admin && (
              <>
            <Link to="/orders" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              {t('orders')}
            </Link>
                <Link to="/admin" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                  {t('adminPanel')}
                </Link>
                <button onClick={() => { onAdminLogout(); setIsMenuOpen(false); }} className="mobile-menu-link logout-btn">
                  {t('logout')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Breadcrumb
