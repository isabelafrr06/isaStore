import React, { useState, useMemo } from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl } from '../config.js'
import { formatPrice } from '../utils/formatPrice.js'
import { calculateShipping, calculateTotalWeight } from '../utils/shippingCalculation.js'
import './CheckoutForm.css'

function CheckoutForm({ onCancel, cartItems, total }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    shippingMethod: 'pickup'
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate total weight
  const totalWeight = useMemo(() => calculateTotalWeight(cartItems), [cartItems])
  
  // Calculate shipping cost
  const shippingCost = useMemo(() => {
    return calculateShipping(formData.shippingMethod, totalWeight, formData.address)
  }, [formData.shippingMethod, totalWeight, formData.address])
  
  // Calculate grand total
  const grandTotal = useMemo(() => {
    if (shippingCost === null) return total // Uber - price to be determined
    return total + shippingCost
  }, [total, shippingCost])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // For phone field, only allow digits and limit to 8
    let processedValue = value
    if (name === 'phone') {
      // Remove all non-digit characters
      processedValue = value.replace(/\D/g, '')
      // Limit to 8 digits
      if (processedValue.length > 8) {
        processedValue = processedValue.slice(0, 8)
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleWhatsAppCheckout = async (e) => {
    e.preventDefault()
    
    // Validation - name, phone, and address are required
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = t('fieldRequired')
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('fieldRequired')
    } else if (formData.phone.replace(/\D/g, '').length !== 8) {
      newErrors.phone = t('invalidPhone')
    }
    if (!formData.address.trim()) {
      newErrors.address = t('fieldRequired')
    }
    
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    // Build WhatsApp message first
    const itemsText = cartItems.map(item => 
      `• ${item.name} x${item.quantity} - ₡${formatPrice((parseInt(item.price) || 0) * item.quantity)}`
    ).join('\n')
    
    // Shipping method text
    let shippingText = ''
    if (formData.shippingMethod === 'pickup') {
      shippingText = `${t('shippingMethod')}: ${t('shippingPickup')} (${t('free')})`
    } else if (formData.shippingMethod === 'correos') {
      shippingText = `${t('shippingMethod')}: ${t('shippingCorreos')} - ₡${formatPrice(shippingCost)}`
    } else if (formData.shippingMethod === 'uber') {
      shippingText = `${t('shippingMethod')}: ${t('shippingUber')} - ${t('requestPriceWhatsApp')}`
    }
    
    const message = `${t('whatsAppMessagePrefix')}

${itemsText}

${t('subtotal')}: ₡${formatPrice(total)}
${shippingText}
${t('total')}: ₡${formatPrice(shippingCost === null ? total : grandTotal)}

${t('fullName')}: ${formData.name}
${t('phone')}: ${formData.phone}
${t('address')}: ${formData.address}`

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)
    const whatsappPhone = t('whatsAppPhone')
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`
    
    console.log('WhatsApp URL:', whatsappUrl)

    try {
      // Register the order in the database
      const orderResponse = await fetch(getApiUrl('/api/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address
        })
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Order registration failed:', errorData)
        // Still open WhatsApp even if order registration fails
      } else {
        console.log('Order registered successfully')
      }
    } catch (error) {
      console.error('Error registering order:', error)
      // Still proceed to open WhatsApp
    }

    // Always open WhatsApp, even if order registration failed
    const whatsappWindow = window.open(whatsappUrl, '_blank')
    
    if (!whatsappWindow) {
      // Pop-up was blocked, try alternative method
      alert(`${t('whatsAppBlocked') || 'Please allow pop-ups to open WhatsApp, or click here:'} ${whatsappUrl}`)
      // Try using location as fallback
      window.location.href = whatsappUrl
    }
    
    // Close the form
    setIsSubmitting(false)
    onCancel()
  }

  return (
    <div className="checkout-overlay">
      <div className="checkout-form-container">
        <div className="checkout-form-header">
          <h2>{t('checkoutInformation')}</h2>
          <button onClick={onCancel} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleWhatsAppCheckout} className="checkout-form">
          <div className="form-group">
            <label htmlFor="name">{t('fullName')} *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">{t('phoneWithDigits')}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              maxLength={8}
              pattern="[0-9]{8}"
              placeholder="83047863"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">{t('address')} *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="shippingMethod">{t('shippingMethod')} *</label>
            <select
              id="shippingMethod"
              name="shippingMethod"
              value={formData.shippingMethod}
              onChange={handleChange}
              className={errors.shippingMethod ? 'error' : ''}
            >
              <option value="pickup">{t('shippingPickup')} - {t('free')}</option>
              <option value="correos">{t('shippingCorreos')} - ₡{shippingCost !== null && shippingCost !== undefined ? formatPrice(shippingCost) : '...'}</option>
              <option value="uber">{t('shippingUber')} - {t('requestPriceWhatsApp')}</option>
            </select>
            {formData.shippingMethod === 'correos' && (
              <p className="shipping-info">
                {t('shippingCorreosInfo').replace('{weight}', totalWeight.toFixed(1)).replace('{cost}', formatPrice(shippingCost))}
              </p>
            )}
            {formData.shippingMethod === 'uber' && (
              <p className="shipping-info">
                {t('shippingUberInfo')}
              </p>
            )}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>{t('subtotal')}:</span>
              <span>₡{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>{t('shipping')}:</span>
              <span>
                {shippingCost === null ? t('requestPriceWhatsApp') : 
                 shippingCost === 0 ? t('free') : 
                 `₡${formatPrice(shippingCost)}`}
              </span>
            </div>
            <div className="summary-row total">
              <span>{t('total')}:</span>
              <span>₡{formatPrice(shippingCost === null ? total : grandTotal)}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="whatsapp-btn" disabled={isSubmitting}>
              {isSubmitting ? '⏳ ' : '📱 '}{t('completeViaWhatsApp')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutForm

