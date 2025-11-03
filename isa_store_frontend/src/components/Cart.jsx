import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getImageUrl } from '../config.js'
import { getCart, removeFromCart as removeFromCartService, updateQuantity as updateQuantityService, clearCart as clearCartService } from '../services/cartService.js'
import { formatPrice } from '../utils/formatPrice.js'
import CheckoutForm from './CheckoutForm'
import './Cart.css'

function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    loadCart()
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart()
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const loadCart = () => {
    const cartData = getCart()
    setCart(cartData)
    setLoading(false)
  }

  const handleRemoveFromCart = (itemId) => {
    removeFromCartService(itemId)
    loadCart()
  }

  const handleUpdateQuantity = (itemId, quantity) => {
    updateQuantityService(itemId, quantity)
    loadCart()
  }

  const handleClearCart = () => {
    clearCartService()
    loadCart()
  }

  const handleCheckoutClick = () => {
    setShowCheckoutForm(true)
  }

  const total = cart.reduce((sum, item) => sum + (parseInt(item.price) || 0) * item.quantity, 0)

  if (loading) {
    return <div className="loading">{t('loadingCart')}</div>
  }

  return (
    <div className="cart">
      <h2 className="page-title">{t('shoppingCart')}</h2>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>{t('emptyCart')}</p>
          <Link to="/" className="continue-shopping">{t('continueShopping')}</Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={getImageUrl(item.image)} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">₡{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn">
                    {t('remove')}
                  </button>
                </div>
                <div className="cart-item-total">
                  ₡{formatPrice(parseInt(item.price) * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>{t('orderSummary')}</h3>
            <div className="summary-row">
              <span>{t('subtotal')}:</span>
              <span>₡{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>{t('shipping')}:</span>
              <span>{t('free')}</span>
            </div>
            <div className="summary-row total">
              <span>{t('total')}:</span>
              <span>₡{formatPrice(total)}</span>
            </div>
            <button onClick={handleCheckoutClick} className="checkout-btn">
              {t('checkout')}
            </button>
            <button onClick={handleClearCart} className="clear-cart-btn">
              {t('clearCart')}
            </button>
          </div>
        </div>
      )}
      
      {showCheckoutForm && (
        <CheckoutForm 
          onCancel={() => {
            setShowCheckoutForm(false)
            loadCart() // Refresh cart after order
          }}
          cartItems={cart}
          total={total}
        />
      )}
    </div>
  )
}

export default Cart

