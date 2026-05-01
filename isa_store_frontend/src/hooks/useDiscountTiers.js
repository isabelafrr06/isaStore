import { useState, useEffect } from 'react'
import { getApiUrl } from '../config.js'

let cache = null
let pending = null

export function useDiscountTiers() {
  const [discountTiers, setDiscountTiers] = useState(cache)

  useEffect(() => {
    if (cache) return

    if (!pending) {
      pending = fetch(getApiUrl('/api/discount_tiers'))
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch discount tiers')
          return res.json()
        })
        .then(data => {
          cache = data.map(tier => ({
            minQuantity: tier.min_quantity,
            discountPercent: parseFloat(tier.discount_percent)
          }))
          return cache
        })
        .catch(err => {
          console.error('Error fetching discount tiers:', err)
          pending = null
        })
    }

    let cancelled = false
    pending.then(tiers => {
      if (!cancelled && tiers) setDiscountTiers(tiers)
    })

    return () => { cancelled = true }
  }, [])

  return discountTiers
}
