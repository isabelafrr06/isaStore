/**
 * Calculate shipping cost based on method and total weight
 * @param {string} method - Shipping method: 'pickup', 'correos', 'uber'
 * @param {number} totalWeight - Total weight in kilograms
 * @param {string} address - Customer address (for pickup check)
 * @returns {number|null} Shipping cost in colones, or null for Uber
 */
export function calculateShipping(method, totalWeight, address = '') {
  // Free pickup in Belén de Heredia
  if (method === 'pickup') {
    const belenKeywords = ['belén', 'belen', 'heredia'];
    const addressLower = address.toLowerCase();
    const isInBelen = belenKeywords.some(keyword => addressLower.includes(keyword));
    return isInBelen ? 0 : 0; // Free for pickup
  }
  
  // Correos de Costa Rica: 3500 for first kg, +1300 for each additional kg
  if (method === 'correos') {
    if (totalWeight <= 0) return 0;
    if (totalWeight <= 1) return 3500;
    const additionalKg = Math.ceil(totalWeight - 1);
    return 3500 + (additionalKg * 1300);
  }
  
  // Uber: Request price via WhatsApp (return null to indicate manual quote needed)
  if (method === 'uber') {
    return null; // null means price needs to be requested
  }
  
  return 0;
}

/**
 * Calculate total weight from cart items
 * @param {Array} cartItems - Array of cart items with product weight
 * @returns {number} Total weight in kilograms
 */
export function calculateTotalWeight(cartItems) {
  return cartItems.reduce((total, item) => {
    const weight = parseFloat(item.weight || item.product?.weight || 0.5);
    const quantity = parseInt(item.quantity || 1);
    return total + (weight * quantity);
  }, 0);
}

