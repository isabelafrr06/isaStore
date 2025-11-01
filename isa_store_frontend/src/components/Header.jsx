import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl } from '../config.js'
import './Header.css'

function Header({ admin, onAdminLogout }) {
  const [cartCount, setCartCount] = useState(0)
  const { t, language, toggleLanguage } = useLanguage()

  useEffect(() => {
    fetchCartCount()
    
    // Refresh cart count periodically
    const interval = setInterval(fetchCartCount, 2000)
    return () => clearInterval(interval)
  }, [])

  const fetchCartCount = () => {
    fetch(getApiUrl('/api/cart'))
      .then(res => res.json())
      .then(data => {
        const count = data.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(count)
      })
      .catch(err => console.error('Error fetching cart:', err))
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

