import React, { createContext, useContext, useState, useEffect } from 'react'
import { getApiUrl } from '../config.js'

const CACHE_KEY = 'isastore_categories'
const CACHE_TTL = 5 * 60 * 1000

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    return Date.now() - timestamp < CACHE_TTL ? data : null
  } catch { return null }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {}
}

const CategoriesContext = createContext([])

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(() => getCached() || [])

  useEffect(() => {
    fetch(getApiUrl('/api/categories'))
      .then(res => res.json())
      .then(data => {
        const cats = data.categories || []
        setCategories(cats)
        setCache(cats)
      })
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  return (
    <CategoriesContext.Provider value={categories}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  return useContext(CategoriesContext)
}
