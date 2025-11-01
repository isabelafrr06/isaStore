import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl } from '../config.js'
import './Header.css'

function Header({ admin, onAdminLogout }) {
  const [cartCount, setCartCount] = useState(0)
  const { t, language, toggleLanguage } = useLanguage()

  useEffect(() => {
    // Fetch cart count on mount
    fetchCartCount()
    
    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCartCount()
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const fetchCartCount = () => {
    fetch(getApiUrl('/api/cart'))
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          const count = data.reduce((sum, item) => sum + item.quantity, 0)
          setCartCount(count)
        }
      })
      .catch(err => {
        // Only log if it's not a 404 (might be expected if cart is empty/not initialized)
        if (!err.message?.includes('404')) {
          console.error('Error fetching cart:', err)
        }
        setCartCount(0)
      })
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

