import { useState, useEffect } from 'react'
import { getApiUrl } from '../config.js'

export function useDiscountTiers() {
  const [discountTiers, setDiscountTiers] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetch(getApiUrl('/api/discount_tiers'))
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Failed to fetch discount tiers')
      })
      .then(data => {
        if (!cancelled) {
          const tiers = data.map(tier => ({
            minQuantity: tier.min_quantity,
            discountPercent: parseFloat(tier.discount_percent)
          }))
          setDiscountTiers(tiers)
        }
      })
      .catch(err => {
        console.error('Error fetching discount tiers:', err)
      })

    return () => { cancelled = true }
  }, [])

  return discountTiers
}
