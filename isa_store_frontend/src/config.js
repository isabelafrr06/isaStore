// API configuration
// In development, Vite proxy handles /api routes
// In production, use full backend URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export const getApiUrl = (path) => {
  // If VITE_API_URL is set, use it (production)
  // Otherwise, use relative path (development with proxy)
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`
  }
  return path
}

// Get image URL (images are served from backend)
export const getImageUrl = (imagePath) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}/images/${imagePath}`
  }
  return `http://localhost:3001/images/${imagePath}`
}




