import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl, getImageUrl } from '../config.js'
import { addToCart as addToCartService } from '../services/cartService.js'
import { formatPrice } from '../utils/formatPrice.js'
import { calculateBulkDiscount } from '../utils/discountCalculation.js'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const { t } = useLanguage()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [discountTiers, setDiscountTiers] = useState(null)

  useEffect(() => {
    fetch(getApiUrl(`/api/products/${id}`))
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching product:', err)
        setLoading(false)
      })
    fetchDiscountTiers()
  }, [id])

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

  // Calculate discount for current quantity
  const discountInfo = useMemo(() => {
    if (!product || !discountTiers) return null
    const subtotal = product.price * quantity
    return calculateBulkDiscount(quantity, subtotal, discountTiers)
  }, [product, quantity, discountTiers])

  // Get the lowest discount tier (for display)
  const lowestDiscountTier = useMemo(() => {
    if (!discountTiers || discountTiers.length === 0) return null
    return discountTiers.sort((a, b) => a.minQuantity - b.minQuantity)[0]
  }, [discountTiers])

  const addToCart = () => {
    // Check if product is out of stock
    if (product.stock <= 0) {
      setMessage(t('productOutOfStock'))
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    // Check if requested quantity exceeds available stock
    if (quantity > product.stock) {
      setMessage(t('notEnoughStock'))
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    try {
      // Add to local cart
      addToCartService(product, quantity)
      setMessage(t('productAddedToCart'))
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Error adding to cart:', err)
      setMessage(t('errorAddingToCart'))
    }
  }

  if (loading) {
    return <div className="loading">{t('loadingProduct')}</div>
  }

  if (!product) {
    return <div className="error">{t('productNotFound')}</div>
  }

  return (
    <div className="product-detail">
      <Link to="/" className="back-link">{t('backToProducts')}</Link>
      
      <div className="product-detail-container">
        <div className="product-image-container">
          {(() => {
            // Get all images - prefer images array, fallback to image field
            const allImages = (product.images && product.images.length > 0) 
              ? product.images 
              : (product.image ? [product.image] : []);
            
            if (allImages.length === 0) {
              return <div className="no-image">No image available</div>;
            }
            
            return (
              <>
                <div className="main-image-wrapper">
                  <img 
                    src={getImageUrl(allImages[selectedImageIndex] || allImages[0])} 
                    alt={product.name} 
                    className="detail-image" 
                  />
                </div>
                {allImages.length > 1 && (
                  <div className="product-image-thumbnails">
                    {allImages.map((img, index) => (
                      <img
                        key={index}
                        src={getImageUrl(img)}
                        alt={`${product.name} - Image ${index + 1}`}
                        className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
        
        <div className="product-details">
          <h1 className="detail-title">{product.name}</h1>
          <div className="price-section">
            {discountInfo && discountInfo.hasDiscount ? (
              <div className="price-row-detail">
                <span className="detail-price original">₡{formatPrice(product.price)}</span>
                <span className="price-arrow">→</span>
                <span className="detail-price discounted">₡{formatPrice(discountInfo.finalTotal / quantity)}</span>
                <span className="discount-label">
                  {t('savePercent', { percent: discountInfo.discountPercent })}
                </span>
              </div>
            ) : (
              <p className="detail-price">₡{formatPrice(product.price)}</p>
            )}
            {lowestDiscountTier && quantity < lowestDiscountTier.minQuantity && (
              <div className="discount-hint">
                {t('buyXAndSave', { quantity: lowestDiscountTier.minQuantity, percent: lowestDiscountTier.discountPercent })}
              </div>
            )}
          </div>
          {product.condition && (
            <div className={`product-condition ${product.condition}`}>
              <strong>{t('condition')}:</strong> {product.condition === 'new' ? t('new') : t('used')}
            </div>
          )}
          <p className="detail-description">{product.description}</p>
          
          <div className="quantity-selector">
            <label htmlFor="quantity">{t('quantity')}:</label>
            <input
              id="quantity"
              type="number"
              min={product.stock > 0 ? 1 : 0}
              max={product.stock > 0 ? product.stock : 0}
              value={product.stock > 0 ? quantity : 0}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value) || 1
                const maxQuantity = product.stock > 0 ? product.stock : 0
                setQuantity(Math.min(Math.max(newQuantity, 1), maxQuantity))
              }}
              disabled={product.stock <= 0}
            />
          </div>
          {discountInfo && discountInfo.hasDiscount && (
            <div className="discount-applied-message">
              🎉 {t('discountAppliedForQuantity', { quantity: quantity, percent: discountInfo.discountPercent })}
            </div>
          )}
          
          <button 
            onClick={addToCart} 
            className={`add-to-cart-btn ${product.stock <= 0 ? 'disabled' : ''}`}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? t('outOfStock') : t('addToCart')}
          </button>
          
          {message && <div className={`message ${product.stock <= 0 ? 'error' : ''}`}>{message}</div>}
          
          <div className={`product-stock ${product.stock <= 0 ? 'out-of-stock' : ''}`}>
            {t('stock')}: {product.stock} {product.stock > 0 ? t('available') : t('unavailable')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

