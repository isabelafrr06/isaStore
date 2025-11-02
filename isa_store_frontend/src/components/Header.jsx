import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getCartCount } from '../services/cartService.js'
import './Header.css'

function Header({ admin, onAdminLogout }) {
  const [cartCount, setCartCount] = useState(0)
  const { t, language, toggleLanguage } = useLanguage()

  useEffect(() => {
    // Load cart count on mount
    updateCartCount()
    
    // Listen for cart update events
    const handleCartUpdate = () => {
      updateCartCount()
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const updateCartCount = () => {
    const count = getCartCount()
    setCartCount(count)
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>IsaStore</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">{t('home')}</Link>
          <Link to="/about" className="nav-link">{t('about')}</Link>
          <Link to="/cart" className="nav-link cart-link">
            <span>{t('cart')} {cartCount > 0 && `(${cartCount})`}</span>
          </Link>
          {admin && <Link to="/orders" className="nav-link">{t('orders')}</Link>}
          {admin && (
            <>
              <Link to="/admin" className="nav-link">{t('adminPanel')}</Link>
              <button onClick={onAdminLogout} className="nav-link logout-btn">{t('logout')}</button>
            </>
          )}
          <button onClick={toggleLanguage} className="nav-link language-btn">
            {language === 'es' ? 'EN' : 'ES'}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header

