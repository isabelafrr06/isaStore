import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl, getImageUrl } from '../config.js'
import './ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts(selectedCategory)
  }, [selectedCategory])

  const fetchCategories = () => {
    fetch(getApiUrl('/api/categories'))
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || [])
      })
      .catch(err => {
        console.error('Error fetching categories:', err)
      })
  }

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
        {categories.map(category => (
          <button 
            key={category.id}
            className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.name)}
          >
            {language === 'es' ? category.name_es : category.name_en}
          </button>
        ))}
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
