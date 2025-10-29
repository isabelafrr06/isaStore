import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  es: {
    // Navigation
    home: 'Inicio',
    about: 'Acerca de',
    cart: 'Carrito',
    orders: 'Pedidos',
    adminPanel: 'Panel Admin',
    logout: 'Cerrar Sesión',
    adminLogin: 'Admin Login',
    
    // Product List
    ourProducts: 'Nuestros Productos',
    loadingProducts: 'Cargando productos...',
    viewDetails: 'Ver',
    
    // Cart
    shoppingCart: 'Carrito de Compras',
    loadingCart: 'Cargando carrito...',
    emptyCart: 'Tu carrito está vacío',
    continueShopping: 'Continuar Comprando',
    remove: 'Eliminar',
    orderSummary: 'Resumen del Pedido',
    subtotal: 'Subtotal',
    shipping: 'Envío',
    free: 'Gratis',
    total: 'Total',
    checkout: 'Finalizar Compra',
    clearCart: 'Vaciar Carrito',
    
    // Product Detail
    loadingProduct: 'Cargando producto...',
    productNotFound: 'Producto no encontrado',
    backToProducts: '← Volver a Productos',
    quantity: 'Cantidad',
    addToCart: 'Agregar al Carrito',
    productAddedToCart: '¡Producto agregado al carrito!',
    errorAddingToCart: 'Error al agregar producto al carrito',
    stock: 'Stock',
    available: 'disponible',
    
    // About
    aboutTitle: 'Acerca de IsaStore',
    ourStory: 'Nuestra Historia',
    ourStoryText: 'Bienvenido a IsaStore, tu destino principal para electrónicos de alta calidad y accesorios tecnológicos. Fundada con pasión por la tecnología e innovación, hemos estado sirviendo a nuestros clientes con los últimos gadgets y accesorios confiables desde nuestros inicios.',
    ourMission: 'Nuestra Misión',
    ourMissionText: 'Creemos que la tecnología debe mejorar tu vida, no complicarla. Por eso seleccionamos cuidadosamente nuestros productos para traerte solo lo mejor, los electrónicos y accesorios más confiables que ofrecen gran valor por tu dinero.',
    whatWeOffer: 'Lo que Ofrecemos',
    whatWeOfferItem1: '🎧 Auriculares inalámbricos premium y equipos de audio',
    whatWeOfferItem2: '⌚ Relojes inteligentes y tecnología wearable',
    whatWeOfferItem3: '💻 Accesorios y periféricos para computadora',
    whatWeOfferItem4: '🔌 Hubs USB y soluciones de conectividad',
    whatWeOfferItem5: '🖱️ Ratones y teclados ergonómicos',
    whatWeOfferItem6: '📱 Accesorios móviles y gadgets',
    whyChooseUs: '¿Por qué Elegirnos?',
    fastShipping: '🚚 Envío Rápido',
    fastShippingText: 'Entrega rápida y confiable a tu puerta',
    qualityGuarantee: '🛡️ Garantía de Calidad',
    qualityGuaranteeText: 'Todos los productos vienen con garantía del fabricante',
    support247: '💬 Soporte 24/7',
    support247Text: 'Nuestro equipo está aquí para ayudarte en cualquier momento',
    bestPrices: '💰 Mejores Precios',
    bestPricesText: 'Precios competitivos sin comprometer la calidad',
    contactUs: 'Contáctanos',
    contactUsText: '¿Tienes preguntas o necesitas asistencia? ¡Estamos aquí para ayudarte! Comunícate con nosotros a través de nuestros canales de contacto o visita nuestra tienda para un servicio personalizado.',
    contactEmail: '📧 Email: info@isastore.com',
    contactPhone: '📞 Teléfono: +506 83047863',
    contactAddress: '📍 Dirección: San Antonio de Belen, Heredia, Costa Rica',
    
    // Footer
    quickLinks: 'Enlaces Rápidos',
    support: 'Soporte',
    contactInfo: 'Información de Contacto',
    whatsappUs: 'Escríbenos por WhatsApp',
    privacyPolicy: 'Política de Privacidad',
    termsOfService: 'Términos de Servicio',
    allRightsReserved: 'Todos los derechos reservados',
    
    // Admin
    adminDashboard: 'Panel de Administración',
    addNewProduct: 'Agregar Nuevo Producto',
    cancel: 'Cancelar',
    editProduct: 'Editar Producto',
    saveProduct: 'Guardar Producto',
    edit: 'Editar',
    delete: 'Eliminar',
    productName: 'Nombre del Producto',
    price: 'Precio',
    description: 'Descripción',
    image: 'Imagen',
    stock: 'Stock',
    orEnterImageFilename: 'O ingresa nombre del archivo de imagen',
    
    // Breadcrumb
    details: 'Detalles',
    product: 'Producto',
    products: 'Productos',
    
    // Orders
    myOrders: 'Mis Pedidos',
    loadingOrders: 'Cargando pedidos...',
    noOrdersYet: 'Aún no has realizado ningún pedido',
    order: 'Pedido',
    
    // Checkout Form
    checkoutInformation: 'Información de Compra',
    fullName: 'Nombre Completo',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    address: 'Dirección',
    city: 'Ciudad',
    zipCode: 'Código Postal',
    fieldRequired: 'Este campo es obligatorio',
    invalidEmail: 'Correo electrónico inválido',
    invalidPhone: 'El teléfono debe tener exactamente 8 dígitos',
    phoneWithDigits: 'Teléfono * (8 dígitos)',
    completePurchase: 'Completar Compra',
    
    // Cart Messages
    orderPlacedSuccess: '¡Pedido realizado con éxito!',
    errorPlacingOrder: 'Error al realizar el pedido',
    
    // WhatsApp Checkout
    completeViaWhatsApp: 'Completar por WhatsApp',
    whatsAppPhone: '50683047863',
    whatsAppMessagePrefix: 'Hola! Me gustaría realizar el siguiente pedido:'
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    cart: 'Cart',
    orders: 'Orders',
    adminPanel: 'Admin Dashboard',
    logout: 'Logout',
    adminLogin: 'Admin Login',
    
    // Product List
    ourProducts: 'Our Products',
    loadingProducts: 'Loading products...',
    viewDetails: 'View',
    
    // Cart
    shoppingCart: 'Shopping Cart',
    loadingCart: 'Loading cart...',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    remove: 'Remove',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    total: 'Total',
    checkout: 'Checkout',
    clearCart: 'Clear Cart',
    
    // Product Detail
    loadingProduct: 'Loading product...',
    productNotFound: 'Product not found',
    backToProducts: '← Back to Products',
    quantity: 'Quantity',
    addToCart: 'Add to Cart',
    productAddedToCart: 'Product added to cart!',
    errorAddingToCart: 'Error adding product to cart',
    stock: 'Stock',
    available: 'available',
    
    // About
    aboutTitle: 'About IsaStore',
    ourStory: 'Our Story',
    ourStoryText: 'Welcome to IsaStore, your premier destination for high-quality electronics and tech accessories. Founded with a passion for technology and innovation, we have been serving our customers with the latest gadgets and reliable accessories since our inception.',
    ourMission: 'Our Mission',
    ourMissionText: 'We believe technology should enhance your life, not complicate it. That\'s why we carefully curate our products to bring you only the best, the most reliable electronics and accessories that offer great value for your money.',
    whatWeOffer: 'What We Offer',
    whatWeOfferItem1: '🎧 Premium wireless headphones and audio equipment',
    whatWeOfferItem2: '⌚ Smartwatches and wearable technology',
    whatWeOfferItem3: '💻 Computer accessories and peripherals',
    whatWeOfferItem4: '🔌 USB hubs and connectivity solutions',
    whatWeOfferItem5: '🖱️ Ergonomic mice and keyboards',
    whatWeOfferItem6: '📱 Mobile accessories and gadgets',
    whyChooseUs: 'Why Choose Us?',
    fastShipping: '🚚 Fast Shipping',
    fastShippingText: 'Quick and reliable delivery to your door',
    qualityGuarantee: '🛡️ Quality Guarantee',
    qualityGuaranteeText: 'All products come with manufacturer warranty',
    support247: '💬 24/7 Support',
    support247Text: 'Our team is here to help you anytime',
    bestPrices: '💰 Best Prices',
    bestPricesText: 'Competitive prices without compromising quality',
    contactUs: 'Contact Us',
    contactUsText: 'Have questions or need assistance? We\'re here to help! Reach out through our contact channels or visit our store for personalized service.',
    contactEmail: '📧 Email: info@isastore.com',
    contactPhone: '📞 Phone: +506 83047863',
    contactAddress: '📍 Address: San Antonio de Belen, Heredia, Costa Rica',
    
    // Footer
    quickLinks: 'Quick Links',
    support: 'Support',
    contactInfo: 'Contact Info',
    whatsappUs: 'WhatsApp Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    allRightsReserved: 'All rights reserved',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    addNewProduct: 'Add New Product',
    cancel: 'Cancel',
    editProduct: 'Edit Product',
    saveProduct: 'Save Product',
    edit: 'Edit',
    delete: 'Delete',
    productName: 'Product Name',
    price: 'Price',
    description: 'Description',
    image: 'Image',
    stock: 'Stock',
    orEnterImageFilename: 'Or enter image filename',
    
    // Breadcrumb
    details: 'Details',
    product: 'Product',
    products: 'Products',
    
    // Orders
    myOrders: 'My Orders',
    loadingOrders: 'Loading orders...',
    noOrdersYet: 'You haven\'t placed any orders yet',
    order: 'Order',
    
    // Checkout Form
    checkoutInformation: 'Checkout Information',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    zipCode: 'Zip Code',
    fieldRequired: 'This field is required',
    invalidEmail: 'Invalid email address',
    invalidPhone: 'Phone must have exactly 8 digits',
    phoneWithDigits: 'Phone * (8 digits)',
    completePurchase: 'Complete Purchase',
    
    // Cart Messages
    orderPlacedSuccess: 'Order placed successfully!',
    errorPlacingOrder: 'Error placing order',
    
    // WhatsApp Checkout
    completeViaWhatsApp: 'Complete via WhatsApp',
    whatsAppPhone: '50683047863',
    whatsAppMessagePrefix: 'Hello! I would like to place the following order:'
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es') // Default to Spanish
  
  const t = (key) => {
    return translations[language][key] || key
  }
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es')
  }
  
  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
