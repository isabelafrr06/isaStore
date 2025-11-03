// API configuration
// In development, Vite proxy handles /api routes
// In production, use full backend URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export const getApiUrl = (path) => {
  // If VITE_API_URL is set, use it (production)
  // Otherwise, use relative path (development with proxy)
  if (API_BASE_URL) {
    // Remove trailing slash from API_BASE_URL if present
    const base = API_BASE_URL.replace(/\/$/, '')
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${base}${normalizedPath}`
  }
  return path
}

// Get image URL (images are served from backend)
export const getImageUrl = (imagePath) => {
  if (API_BASE_URL) {
    // Remove trailing slash from API_BASE_URL if present
    const base = API_BASE_URL.replace(/\/$/, '')
    // Remove leading slash from imagePath if present
    const normalizedImagePath = imagePath.replace(/^\//, '')
    return `${base}/images/${normalizedImagePath}`
  }
  return `http://localhost:3001/images/${imagePath}`
}

// Store location coordinates
// To get exact coordinates:
// 1. Go to Google Maps
// 2. Right-click on your exact location
// 3. Click on the coordinates that appear
// 4. Copy latitude and longitude
// Format: { latitude: 9.9889, longitude: -84.1794 }
export const STORE_COORDINATES = {
  latitude: 9.974332,  // Set your latitude here (e.g., 9.9889)
  longitude: -84.190635  // Set your longitude here (e.g., -84.1794)
}

// Get map URLs
export const getGoogleMapsUrl = (address) => {
  // If coordinates are set, use them for exact location
  if (STORE_COORDINATES.latitude && STORE_COORDINATES.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${STORE_COORDINATES.latitude},${STORE_COORDINATES.longitude}`
  }
  // Otherwise, use address (text search)
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export const getWazeUrl = (address) => {
  // If coordinates are set, use them for exact location
  if (STORE_COORDINATES.latitude && STORE_COORDINATES.longitude) {
    return `https://waze.com/ul?ll=${STORE_COORDINATES.latitude},${STORE_COORDINATES.longitude}&navigate=yes`
  }
  // Otherwise, use address (text search)
  return `https://waze.com/ul?q=${encodeURIComponent(address)}`
}




