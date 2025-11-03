// Format price with thousand separator (dot)
// Example: 1234567 -> "1.234.567"
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0';
  
  const numPrice = parseInt(price) || 0;
  return numPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

