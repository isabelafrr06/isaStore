// Cart service using localStorage for client-side cart management
// Each user has their own cart stored in their browser

const CART_STORAGE_KEY = 'isastore_cart';

// Get cart from localStorage
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Add item to cart
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.productId === product.id);
  const availableStock = product.stock || 0;
  
  if (existingItemIndex >= 0) {
    // Update quantity if item already exists, but respect stock limit
    const newQuantity = cart[existingItemIndex].quantity + quantity;
    cart[existingItemIndex].quantity = Math.min(newQuantity, availableStock);
    // Update stock if it changed
    if (cart[existingItemIndex].stock !== availableStock) {
      cart[existingItemIndex].stock = availableStock;
    }
  } else {
    // Add new item
    cart.push({
      id: Date.now(), // Unique ID for cart item
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || (product.images && product.images[0]),
      weight: product.weight || 0.5,
      stock: availableStock,
      quantity: Math.min(quantity, availableStock)
    });
  }
  
  saveCart(cart);
  return cart;
};

// Remove item from cart
export const removeFromCart = (itemId) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== itemId);
  saveCart(updatedCart);
  return updatedCart;
};

// Update item quantity
export const updateQuantity = (itemId, quantity) => {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      return removeFromCart(itemId);
    } else {
      // Limit quantity to available stock
      const maxQuantity = cart[itemIndex].stock || Infinity;
      cart[itemIndex].quantity = Math.min(quantity, maxQuantity);
      saveCart(cart);
    }
  }
  
  return cart;
};

// Clear entire cart
export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
  return [];
};

// Get cart total
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Get cart item count
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

