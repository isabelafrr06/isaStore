import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl, getImageUrl } from '../config.js'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const { t } = useLanguage()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

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
  }, [id])

  const addToCart = () => {
    fetch(getApiUrl('/api/cart/add'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: parseInt(id),
        quantity: quantity
      })
    })
    .then(res => res.json())
    .then(() => {
      setMessage(t('productAddedToCart'))
      setTimeout(() => setMessage(''), 3000)
      // Trigger cart update event to refresh Header cart count
      window.dispatchEvent(new Event('cartUpdated'))
    })
    .catch(err => {
      console.error('Error adding to cart:', err)
      setMessage(t('errorAddingToCart'))
    })
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
          {product.images && product.images.length > 0 ? (
            <>
              <img 
                src={getImageUrl(product.images[selectedImageIndex] || product.image)} 
                alt={product.name} 
                className="detail-image" 
              />
              {product.images.length > 1 && (
                <div className="product-image-thumbnails">
                  {product.images.map((img, index) => (
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
          ) : (
            <img src={getImageUrl(product.image)} alt={product.name} className="detail-image" />
          )}
        </div>
        
        <div className="product-details">
          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-price">₡{product.price}</p>
          <p className="detail-description">{product.description}</p>
          
          <div className="quantity-selector">
            <label htmlFor="quantity">{t('quantity')}:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>
          
          <button onClick={addToCart} className="add-to-cart-btn">
            {t('addToCart')}
          </button>
          
          {message && <div className="message">{message}</div>}
          
          <div className="product-stock">
            {t('stock')}: {product.stock} {t('available')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

