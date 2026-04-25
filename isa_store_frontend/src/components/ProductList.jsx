import React, { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl, getImageUrl } from '../config.js'
import { formatPrice } from '../utils/formatPrice.js'
import { calculateBulkDiscount } from '../utils/discountCalculation.js'
import { useDiscountTiers } from '../hooks/useDiscountTiers.js'
import './ProductList.css'

const PRODUCTS_CACHE_KEY = 'isastore_products'
const CATEGORIES_CACHE_KEY = 'isastore_categories'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // localStorage full or unavailable
  }
}

function ProductList() {
  const [allProducts, setAllProducts] = useState(() => getCached(PRODUCTS_CACHE_KEY) || [])
  const [categories, setCategories] = useState(() => getCached(CATEGORIES_CACHE_KEY) || [])
  const [loading, setLoading] = useState(!getCached(PRODUCTS_CACHE_KEY))
  const [fetchError, setFetchError] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCondition, setSelectedCondition] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showAllCategories, setShowAllCategories] = useState(false)
  const discountTiers = useDiscountTiers()
  const { t, language } = useLanguage()
  const [searchParams] = useSearchParams()

  // Fetch all products once
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Read category from URL params on mount and when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    setSelectedCategory(categoryParam || '')
  }, [searchParams])

  const fetchCategories = () => {
    fetch(getApiUrl('/api/categories'))
      .then(res => res.json())
      .then(data => {
        const cats = data.categories || []
        setCategories(cats)
        setCache(CATEGORIES_CACHE_KEY, cats)
      })
      .catch(err => {
        console.error('Error fetching categories:', err)
      })
  }

  const fetchProducts = () => {
    setFetchError(false)
    fetch(getApiUrl('/api/products'))
      .then(res => res.json())
      .then(data => {
        setAllProducts(data)
        setCache(PRODUCTS_CACHE_KEY, data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching products:', err)
        if (!getCached(PRODUCTS_CACHE_KEY)) {
          setFetchError(true)
          setTimeout(() => window.location.reload(), 10000)
        } else {
          setLoading(false)
        }
      })
  }

  // Filter and sort client-side
  const products = useMemo(() => {
    let filtered = allProducts

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (selectedCondition) {
      filtered = filtered.filter(p => p.condition === selectedCondition)
    }

    const sorted = [...filtered]
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    return sorted
  }, [allProducts, selectedCategory, selectedCondition, sortBy])

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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const handleConditionChange = (condition) => {
    setSelectedCondition(condition)
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
  }

  if (fetchError) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="loading-icon error-icon">!</div>
          <p className="loading-message">{t('freeServerError')}</p>
          <button className="reload-btn" onClick={() => window.location.reload()}>
            {t('errorBoundaryReload')}
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="loading-spinner" />
          <p className="loading-message">{t('loadingProducts')}</p>
        </div>
      </div>
    )
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
          {(() => {
            const withProducts = categories.filter(c => c.product_count > 0)
            const empty = categories.filter(c => c.product_count === 0)
            const visible = showAllCategories ? withProducts : withProducts.slice(0, 3)
            const hiddenCount = (withProducts.length - visible.length) + empty.length

            return (
              <>
                {visible.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.name)}
                  >
                    {language === 'es' ? category.name_es : category.name_en}
                  </button>
                ))}
                {!showAllCategories && hiddenCount > 0 && (
                  <button
                    className="category-btn more-btn"
                    onClick={() => setShowAllCategories(true)}
                  >
                    +{hiddenCount} {t('more')}
                  </button>
                )}
                {showAllCategories && empty.map(category => (
                  <button
                    key={category.id}
                    className="category-btn disabled"
                    disabled
                  >
                    {language === 'es' ? category.name_es : category.name_en} (0)
                  </button>
                ))}
                {showAllCategories && (
                  <button
                    className="category-btn more-btn"
                    onClick={() => setShowAllCategories(false)}
                  >
                    {t('showLess')}
                  </button>
                )}
              </>
            )
          })()}
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
                <img src={getImageUrl(product.image)} alt={product.name} className="product-image" loading="lazy" />
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
