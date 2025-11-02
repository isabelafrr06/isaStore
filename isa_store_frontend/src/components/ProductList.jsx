import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl, getImageUrl } from '../config.js'
import './ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const { t } = useLanguage()

  useEffect(() => {
    fetchProducts(selectedCategory)
  }, [selectedCategory])

  const fetchProducts = (category) => {
    const url = category 
      ? getApiUrl(`/api/products?category=${category}`)
      : getApiUrl('/api/products')
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching products:', err)
        setLoading(false)
      })
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setLoading(true)
  }

  if (loading) {
    return <div className="loading">{t('loadingProducts')}</div>
  }

  return (
    <div className="product-list">
      <h2 className="page-title">{t('ourProducts')}</h2>
      
      <div className="category-filter">
        <button 
          className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('')}
        >
          {t('allProducts')}
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'Chargers' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('Chargers')}
        >
          {t('chargers')}
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'Laptops' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('Laptops')}
        >
          {t('laptops')}
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'iPads' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('iPads')}
        >
          {t('ipads')}
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'Accessories' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('Accessories')}
        >
          {t('accessories')}
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'Other' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('Other')}
        >
          {t('other')}
        </button>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
            <div className="product-card">
              <img src={getImageUrl(product.image)} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">₡{product.price}</span>
                  <span className="view-btn">
                    {t('viewDetails')}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProductList
