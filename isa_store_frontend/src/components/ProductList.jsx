import React, { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl, getImageUrl } from '../config.js'
import { formatPrice } from '../utils/formatPrice.js'
import { calculateBulkDiscount } from '../utils/discountCalculation.js'
import './ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCondition, setSelectedCondition] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [discountTiers, setDiscountTiers] = useState(null)
  const { t, language } = useLanguage()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchCategories()
    fetchDiscountTiers()
  }, [])

  // Read category from URL params on mount and when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    setSelectedCategory(categoryParam || '')
  }, [searchParams])

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

  // Get the lowest discount tier (for display purposes)
  const lowestDiscountTier = useMemo(() => {
    if (!discountTiers || discountTiers.length === 0) return null
    return discountTiers.sort((a, b) => a.minQuantity - b.minQuantity)[0]
  }, [discountTiers])

  // Calculate discounted price for a product at minimum discount quantity
  const getDiscountedPrice = (price) => {
    if (!lowestDiscountTier) return null
    const discountInfo = calculateBulkDiscount(lowestDiscountTier.minQuantity, price * lowestDiscountTier.minQuantity, discountTiers)
    if (discountInfo.hasDiscount) {
      return discountInfo.finalTotal / lowestDiscountTier.minQuantity
    }
    return null
  }

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
              className={`category-btn ${selectedCategory === category.name ? 'active' : ''} ${category.product_count === 0 ? 'disabled' : ''}`}
              onClick={() => category.product_count > 0 && handleCategoryChange(category.name)}
              disabled={category.product_count === 0}
            >
              {language === 'es' ? category.name_es : category.name_en}
              {category.product_count === 0 && ' (0)'}
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
                <span className={`availability-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? t('available') : t('outOfStock')}
                </span>
                <div className="magnifier-overlay">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <div className="price-container">
                    {lowestDiscountTier && product.stock > 1 ? (() => {
                      const discountedPrice = getDiscountedPrice(product.price)
                      // Only show discount if stock is at least the minimum quantity required
                      const canApplyDiscount = product.stock >= lowestDiscountTier.minQuantity
                      return discountedPrice && canApplyDiscount ? (
                        <div className="price-row">
                          <span className="product-price original">₡{formatPrice(product.price)}</span>
                          <span className="discount-badge-small">
                            {t('buyXAndSave', { quantity: lowestDiscountTier.minQuantity, percent: lowestDiscountTier.discountPercent })}
                          </span>
                          <span className="discounted-price-hover">
                            <span className="price-arrow">→</span>
                            <span className="product-price discounted">₡{formatPrice(discountedPrice)}</span>
                          </span>
                        </div>
                      ) : (
                        <span className="product-price">₡{formatPrice(product.price)}</span>
                      )
                    })() : (
                      <span className="product-price">₡{formatPrice(product.price)}</span>
                    )}
                  </div>
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
