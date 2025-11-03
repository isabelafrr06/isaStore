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
  const [selectedCondition, setSelectedCondition] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, selectedCondition, sortBy])

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

  const fetchProducts = () => {
    const params = new URLSearchParams()
    if (selectedCategory) params.append('category', selectedCategory)
    if (selectedCondition) params.append('condition', selectedCondition)
    if (sortBy) params.append('sort_by', sortBy)
    
    const url = getApiUrl(`/api/products?${params.toString()}`)
    
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

  const handleConditionChange = (condition) => {
    setSelectedCondition(condition)
    setLoading(true)
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
    setLoading(true)
  }

  if (loading) {
    return <div className="loading">{t('loadingProducts')}</div>
  }

  return (
    <div className="product-list">
      <h2 className="page-title">{t('ourProducts')}</h2>
      
      <div className="filters-container">
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

        <div className="filter-controls">
          <div className="filter-group">
            <label>{t('condition')}:</label>
            <select 
              value={selectedCondition} 
              onChange={(e) => handleConditionChange(e.target.value)}
              className="filter-select"
            >
              <option value="">{t('allConditions')}</option>
              <option value="new">{t('new')}</option>
              <option value="used">{t('used')}</option>
            </select>
          </div>

          <div className="filter-group">
            <label>{t('sortBy')}:</label>
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="filter-select"
            >
              <option value="newest">{t('newest')}</option>
              <option value="oldest">{t('oldest')}</option>
              <option value="price_asc">{t('priceAsc')}</option>
              <option value="price_desc">{t('priceDesc')}</option>
              <option value="name_asc">{t('nameAsc')}</option>
              <option value="name_desc">{t('nameDesc')}</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
            <div className="product-card">
              <div className="product-image-container">
                <img src={getImageUrl(product.image)} alt={product.name} className="product-image" />
                {product.condition && (
                  <span className={`condition-badge ${product.condition}`}>
                    {product.condition === 'new' ? t('new') : t('used')}
                  </span>
                )}
              </div>
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
