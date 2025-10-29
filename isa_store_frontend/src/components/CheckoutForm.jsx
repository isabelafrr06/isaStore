import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import './CheckoutForm.css'

function CheckoutForm({ onCancel, cartItems, total }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      `• ${item.name} x${item.quantity} - ₡${(parseFloat(item.price) * item.quantity).toFixed(2)}`
    ).join('\n')
    
    const message = `${t('whatsAppMessagePrefix')}

${itemsText}

${t('total')}: ₡${total.toFixed(2)}

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
      const orderResponse = await fetch('/api/orders', {
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

