import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getImageUrl, getApiUrl } from '../config.js'
import { getCart, removeFromCart as removeFromCartService, updateQuantity as updateQuantityService, clearCart as clearCartService } from '../services/cartService.js'
import { formatPrice } from '../utils/formatPrice.js'
import { calculateBulkDiscount } from '../utils/discountCalculation.js'
import CheckoutForm from './CheckoutForm'
import './Cart.css'

function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [discountTiers, setDiscountTiers] = useState(null)
  const { t } = useLanguage()

  useEffect(() => {
    loadCart()
    fetchDiscountTiers()
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart()
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const fetchDiscountTiers = async () => {
    try {
      const response = await fetch(getApiUrl('/api/discount_tiers'))
      if (response.ok) {
        const data = await response.json()
        const tiers = data.map(tier => ({
          minQuantity: tier.min_quantity,
          discountPercent: parseFloat(tier.discount_percent)
        }))
        setDiscountTiers(tiers)
      }
    } catch (err) {
      console.error('Error fetching discount tiers:', err)
    }
  }

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

  const subtotal = cart.reduce((sum, item) => sum + (parseInt(item.price) || 0) * item.quantity, 0)
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  
  // Calculate bulk discount (use fetched tiers if available)
  const discountInfo = useMemo(() => calculateBulkDiscount(totalQuantity, subtotal, discountTiers), [totalQuantity, subtotal, discountTiers])
  const total = discountInfo.finalTotal

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
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.stock !== undefined && item.quantity >= item.stock}
                    >+</button>
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
              <span>₡{formatPrice(subtotal)}</span>
            </div>
            {discountInfo.hasDiscount && (
              <div className="summary-row discount">
                <span>{t('bulkDiscount')} ({discountInfo.discountPercent}%):</span>
                <span>-₡{formatPrice(discountInfo.discountAmount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>{t('shipping')}:</span>
              <span>{t('calculatedAtCheckout')}</span>
            </div>
            <div className="summary-row total">
              <span>{t('total')}:</span>
              <span>₡{formatPrice(total)}</span>
            </div>
            {discountInfo.hasDiscount && (
              <div className="discount-badge">
                {t('bulkDiscountApplied').replace('{percent}', discountInfo.discountPercent).replace('{quantity}', discountInfo.minQuantity)}
              </div>
            )}
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
          total={subtotal}
        />
      )}
    </div>
  )
}

export default Cart

