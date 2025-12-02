/**
 * Calculate bulk discount based on total quantity
 * @param {number} totalQuantity - Total quantity of items in cart
 * @param {number} subtotal - Subtotal before discount
 * @param {Array} discountTiers - Array of discount tiers from API (optional, will fetch if not provided)
 * @returns {Object} Discount information { discountPercent, discountAmount, finalTotal }
 */
export async function calculateBulkDiscountAsync(totalQuantity, subtotal, discountTiers = null) {
  // If tiers not provided, fetch from API
  if (!discountTiers) {
    try {
      const { getApiUrl } = await import('../config.js')
      const response = await fetch(getApiUrl('/api/discount_tiers'))
      if (response.ok) {
        const data = await response.json()
        discountTiers = data.map(tier => ({
          minQuantity: tier.min_quantity,
          discountPercent: parseFloat(tier.discount_percent)
        }))
      }
    } catch (error) {
      console.error('Error fetching discount tiers:', error)
      // Fallback to default tiers if API fails
      discountTiers = getDefaultTiers()
    }
  }
  
  // Sort tiers by minQuantity descending (highest first)
  discountTiers = discountTiers.sort((a, b) => b.minQuantity - a.minQuantity)
  
  // Find the highest applicable discount tier
  let applicableDiscount = null
  for (const tier of discountTiers) {
    if (totalQuantity >= tier.minQuantity) {
      applicableDiscount = tier
      break
    }
  }
  
  // If no discount applies
  if (!applicableDiscount) {
    return {
      discountPercent: 0,
      discountAmount: 0,
      finalTotal: subtotal,
      hasDiscount: false
    }
  }
  
  // Calculate discount
  const discountAmount = Math.round(subtotal * (applicableDiscount.discountPercent / 100))
  const finalTotal = subtotal - discountAmount
  
  return {
    discountPercent: applicableDiscount.discountPercent,
    discountAmount: discountAmount,
    finalTotal: finalTotal,
    hasDiscount: true,
    minQuantity: applicableDiscount.minQuantity
  }
}

/**
 * Synchronous version - uses cached tiers or defaults
 * @param {number} totalQuantity - Total quantity of items in cart
 * @param {number} subtotal - Subtotal before discount
 * @param {Array} discountTiers - Array of discount tiers (optional)
 * @returns {Object} Discount information
 */
export function calculateBulkDiscount(totalQuantity, subtotal, discountTiers = null) {
  // Use provided tiers or default tiers
  if (!discountTiers) {
    discountTiers = getDefaultTiers()
  }
  
  // Sort tiers by minQuantity descending (highest first)
  discountTiers = discountTiers.sort((a, b) => b.minQuantity - a.minQuantity)
  
  // Find the highest applicable discount tier
  let applicableDiscount = null
  for (const tier of discountTiers) {
    if (totalQuantity >= tier.minQuantity) {
      applicableDiscount = tier
      break
    }
  }
  
  // If no discount applies
  if (!applicableDiscount) {
    return {
      discountPercent: 0,
      discountAmount: 0,
      finalTotal: subtotal,
      hasDiscount: false
    }
  }
  
  // Calculate discount
  const discountAmount = Math.round(subtotal * (applicableDiscount.discountPercent / 100))
  const finalTotal = subtotal - discountAmount
  
  return {
    discountPercent: applicableDiscount.discountPercent,
    discountAmount: discountAmount,
    finalTotal: finalTotal,
    hasDiscount: true,
    minQuantity: applicableDiscount.minQuantity
  }
}

/**
 * Get default discount tiers (fallback)
 */
function getDefaultTiers() {
  return [
    { minQuantity: 10, discountPercent: 15 },
    { minQuantity: 5, discountPercent: 10 },
    { minQuantity: 3, discountPercent: 5 }
  ]
}

/**
 * Get discount description text
 * @param {Object} discountInfo - Discount information object
 * @returns {string} Description of the discount
 */
export function getDiscountDescription(discountInfo) {
  if (!discountInfo.hasDiscount) {
    return ''
  }
  
  return `${discountInfo.discountPercent}% off for ${discountInfo.minQuantity}+ items`
}

