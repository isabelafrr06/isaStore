import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl, getImageUrl } from '../config.js'
import CheckoutForm from './CheckoutForm'
import './Cart.css'

function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = () => {
    fetch(getApiUrl('/api/cart'))
      .then(res => res.json())
      .then(data => {
        setCart(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching cart:', err)
        setLoading(false)
      })
  }

  const removeFromCart = (itemId) => {
    fetch(getApiUrl(`/api/cart/remove/${itemId}`), {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => fetchCart())
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      fetch(getApiUrl(`/api/cart/update/${itemId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      })
      .then(res => res.json())
      .then(() => fetchCart())
    }
  }

  const clearCart = () => {
    fetch(getApiUrl('/api/cart/clear'), {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => fetchCart())
  }

  const checkout = (customerInfo) => {
    fetch(getApiUrl('/api/orders'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        customer_city: customerInfo.city,
        customer_zip_code: customerInfo.zipCode
      })
    })
    .then(res => res.json())
    .then(() => {
      alert(t('orderPlacedSuccess'))
      setShowCheckoutForm(false)
      fetchCart()
    })
    .catch(err => {
      console.error('Error placing order:', err)
      alert(t('errorPlacingOrder'))
    })
  }

  const handleCheckoutClick = () => {
    setShowCheckoutForm(true)
  }

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)

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
                  <p className="cart-item-price">₡{parseFloat(item.price).toFixed(2)}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                    {t('remove')}
                  </button>
                </div>
                <div className="cart-item-total">
                  ₡{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>{t('orderSummary')}</h3>
            <div className="summary-row">
              <span>{t('subtotal')}:</span>
              <span>₡{total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>{t('shipping')}:</span>
              <span>{t('free')}</span>
            </div>
            <div className="summary-row total">
              <span>{t('total')}:</span>
              <span>₡{total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckoutClick} className="checkout-btn">
              {t('checkout')}
            </button>
            <button onClick={clearCart} className="clear-cart-btn">
              {t('clearCart')}
            </button>
          </div>
        </div>
      )}
      
      {showCheckoutForm && (
        <CheckoutForm 
          onCancel={() => {
            setShowCheckoutForm(false)
            fetchCart() // Refresh cart after order
          }}
          cartItems={cart}
          total={total}
        />
      )}
    </div>
  )
}

export default Cart

