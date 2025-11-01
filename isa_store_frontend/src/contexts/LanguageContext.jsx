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
    footerDescription: 'Electrónicos de alta calidad y accesorios tecnológicos.',
    quickLinks: 'Enlaces Rápidos',
    support: 'Soporte',
    contactInfo: 'Información de Contacto',
    contactUs: 'Contáctanos',
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
    whatsAppMessagePrefix: 'Hola! Me gustaría realizar el siguiente pedido:',
    
    // Contact Page
    contactTitle: 'Contáctanos',
    getInTouch: 'Ponte en Contacto',
    contactDescription: 'Estamos aquí para ayudarte. Si tienes alguna pregunta, comentario o necesitas asistencia, no dudes en contactarnos a través de cualquiera de nuestros canales.',
    whatsapp: 'WhatsApp',
    businessHours: 'Horario de Atención',
    mondayToFriday: 'Lunes a Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
    closed: 'Cerrado',
    
    // Shipping Page
    shippingTitle: 'Información de Envío',
    shippingAreas: 'Zonas de Envío',
    shippingAreasDescription: 'Realizamos envíos a todas las zonas de Costa Rica. A continuación puedes ver nuestras opciones de envío:',
    shippingArea1: 'Gran Área Metropolitana (GAM)',
    shippingArea2: 'Provincias principales',
    shippingArea3: 'Zonas rurales (consulta disponibilidad)',
    shippingTimes: 'Tiempos de Envío',
    standardShipping: 'Envío Estándar',
    duration: 'Duración',
    businessDays: 'días hábiles',
    cost: 'Costo',
    standardShippingCost: '2000',
    expressShippingCost: '5000',
    freeShipping: 'Envío Gratis',
    freeShippingDescription: '¡Envío gratis en pedidos superiores a ₡50,000!',
    trackingOrder: 'Seguimiento de Pedidos',
    trackingOrderDescription: 'Una vez que tu pedido sea procesado, recibirás un número de seguimiento por email o WhatsApp para que puedas rastrear tu envío.',
    shippingInfo: 'Información de Envío',
    
    // Returns Page
    returnsTitle: 'Política de Devoluciones',
    returns: 'Devoluciones',
    returnPolicy: 'Política de Devoluciones',
    returnPolicyDescription: 'Queremos que estés completamente satisfecho con tu compra. Si no estás contento con tu producto, puedes devolverlo siguiendo nuestra política de devoluciones.',
    returnPeriod: 'Período de Devolución',
    returnPeriodDescription: 'Tienes 15 días calendario desde la fecha de recepción del producto para solicitar una devolución.',
    returnConditions: 'Condiciones para Devolución',
    returnCondition1: 'El producto debe estar en su empaque original sin abrir',
    returnCondition2: 'Debe incluir todos los accesorios y documentación original',
    returnCondition3: 'El producto no debe tener signos de uso o daño',
    returnCondition4: 'Debe presentarse el comprobante de compra',
    howToReturn: 'Cómo Devolver un Producto',
    returnStep1: 'Contáctanos por WhatsApp o email dentro del período de devolución',
    returnStep2: 'Describe el motivo de la devolución',
    returnStep3: 'Nuestro equipo te proporcionará las instrucciones de devolución',
    returnStep4: 'Una vez recibido y verificado, procesaremos el reembolso',
    refundProcess: 'Proceso de Reembolso',
    refundProcessDescription: 'El reembolso se procesará en un plazo de 5-7 días hábiles una vez que recibamos el producto devuelto. El reembolso se realizará mediante el mismo método de pago utilizado.',
    
    // FAQ Page
    faqTitle: 'Preguntas Frecuentes',
    faq: 'Preguntas Frecuentes',
    faqDescription: 'Encuentra respuestas a las preguntas más comunes sobre nuestros productos, envíos, devoluciones y más.',
    faq1Question: '¿Cómo puedo realizar un pedido?',
    faq1Answer: 'Puedes realizar un pedido agregando productos al carrito y completando el proceso de compra a través de WhatsApp. Solo necesitas proporcionar tu nombre, teléfono y dirección.',
    faq2Question: '¿Cuáles son los métodos de pago aceptados?',
    faq2Answer: 'Aceptamos pagos mediante transferencia bancaria, efectivo contra entrega, y otros métodos acordados por WhatsApp.',
    faq3Question: '¿Cuánto tiempo tarda el envío?',
    faq3Answer: 'El tiempo de envío depende de tu ubicación. Envío estándar: 2-4 días hábiles. Envío express: 1-2 días hábiles. Puedes ver más detalles en nuestra página de Información de Envío.',
    faq4Question: '¿Ofrecen garantía en los productos?',
    faq4Answer: 'Sí, todos nuestros productos vienen con la garantía del fabricante. Si experimentas algún problema, contáctanos y te ayudaremos.',
    faq5Question: '¿Puedo cancelar mi pedido?',
    faq5Answer: 'Puedes cancelar tu pedido contactándonos antes de que sea enviado. Una vez enviado, aplican nuestras políticas de devolución.',
    faq6Question: '¿Cómo puedo hacer seguimiento de mi pedido?',
    faq6Answer: 'Una vez procesado tu pedido, recibirás información de seguimiento por email o WhatsApp para que puedas rastrear tu envío.',
    
    // Privacy Page
    privacyTitle: 'Política de Privacidad',
    lastUpdated: 'Última actualización',
    privacyIntroduction: 'Introducción',
    privacyIntroductionText: 'En IsaStore, nos comprometemos a proteger tu privacidad y tus datos personales. Esta política explica cómo recopilamos, usamos y protegemos tu información.',
    informationWeCollect: 'Información que Recopilamos',
    informationWeCollectDescription: 'Recopilamos la siguiente información cuando realizas una compra:',
    infoCollected1: 'Nombre completo',
    infoCollected2: 'Número de teléfono',
    infoCollected3: 'Dirección de entrega',
    infoCollected4: 'Información de pedidos (historial de compras)',
    howWeUseInfo: 'Cómo Usamos tu Información',
    howWeUseInfoDescription: 'Utilizamos tu información para:',
    useInfo1: 'Procesar y completar tus pedidos',
    useInfo2: 'Comunicarnos contigo sobre tu pedido',
    useInfo3: 'Proporcionar servicio al cliente y soporte',
    useInfo4: 'Mejorar nuestros productos y servicios',
    dataProtection: 'Protección de Datos',
    dataProtectionDescription: 'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal. No compartimos tus datos con terceros sin tu consentimiento, excepto cuando sea necesario para cumplir con la ley.',
    contactPrivacy: 'Contáctanos sobre Privacidad',
    contactPrivacyText: 'Si tienes preguntas sobre nuestra política de privacidad o sobre tus datos personales, contáctanos en:',
    
    // Terms Page
    termsTitle: 'Términos de Servicio',
    termsAcceptance: 'Aceptación de los Términos',
    termsAcceptanceText: 'Al utilizar nuestro sitio web y realizar una compra, aceptas estos términos de servicio. Si no estás de acuerdo, por favor no utilices nuestro servicio.',
    useOfService: 'Uso del Servicio',
    useOfServiceDescription: 'Al usar nuestro servicio, aceptas:',
    useService1: 'Proporcionar información precisa y actualizada',
    useService2: 'Usar el servicio solo para fines legales',
    useService3: 'No intentar acceder no autorizado a nuestros sistemas',
    useService4: 'Respetar los derechos de propiedad intelectual',
    ordersAndPayment: 'Pedidos y Pagos',
    ordersAndPaymentDescription: 'Todos los pedidos están sujetos a disponibilidad de stock. Los precios pueden cambiar sin previo aviso. El pago debe completarse según los términos acordados al realizar el pedido.',
    productAvailability: 'Disponibilidad de Productos',
    productAvailabilityDescription: 'Hacemos nuestro mejor esfuerzo para mantener nuestro inventario actualizado. Si un producto no está disponible, te contactaremos para ofrecerte alternativas o reembolsar tu pago.',
    limitationOfLiability: 'Limitación de Responsabilidad',
    limitationOfLiabilityDescription: 'IsaStore no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso de nuestros productos o servicios, más allá del valor del producto comprado.',
    contactTerms: 'Contáctanos sobre los Términos',
    contactTermsText: 'Si tienes preguntas sobre estos términos de servicio, contáctanos en:'
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
    footerDescription: 'High-quality electronics and tech accessories.',
    quickLinks: 'Quick Links',
    support: 'Support',
    contactInfo: 'Contact Info',
    contactUs: 'Contact Us',
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
    whatsAppMessagePrefix: 'Hello! I would like to place the following order:',
    
    // Contact Page
    contactTitle: 'Contact Us',
    getInTouch: 'Get in Touch',
    contactDescription: 'We are here to help you. If you have any questions, comments, or need assistance, don\'t hesitate to contact us through any of our channels.',
    whatsapp: 'WhatsApp',
    businessHours: 'Business Hours',
    mondayToFriday: 'Monday to Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    closed: 'Closed',
    
    // Shipping Page
    shippingTitle: 'Shipping Information',
    shippingAreas: 'Shipping Areas',
    shippingAreasDescription: 'We ship to all areas of Costa Rica. Below you can see our shipping options:',
    shippingArea1: 'Greater Metropolitan Area (GAM)',
    shippingArea2: 'Main provinces',
    shippingArea3: 'Rural areas (check availability)',
    shippingTimes: 'Shipping Times',
    standardShipping: 'Standard Shipping',
    duration: 'Duration',
    businessDays: 'business days',
    cost: 'Cost',
    standardShippingCost: '2000',
    expressShippingCost: '5000',
    freeShipping: 'Free Shipping',
    freeShippingDescription: 'Free shipping on orders over ₡50,000!',
    trackingOrder: 'Order Tracking',
    trackingOrderDescription: 'Once your order is processed, you will receive a tracking number via email or WhatsApp so you can track your shipment.',
    shippingInfo: 'Shipping Information',
    
    // Returns Page
    returnsTitle: 'Returns Policy',
    returns: 'Returns',
    returnPolicy: 'Returns Policy',
    returnPolicyDescription: 'We want you to be completely satisfied with your purchase. If you are not happy with your product, you can return it following our returns policy.',
    returnPeriod: 'Return Period',
    returnPeriodDescription: 'You have 15 calendar days from the date of receipt of the product to request a return.',
    returnConditions: 'Return Conditions',
    returnCondition1: 'The product must be in its original unopened packaging',
    returnCondition2: 'Must include all original accessories and documentation',
    returnCondition3: 'The product must not show signs of use or damage',
    returnCondition4: 'Must present proof of purchase',
    howToReturn: 'How to Return a Product',
    returnStep1: 'Contact us via WhatsApp or email within the return period',
    returnStep2: 'Describe the reason for the return',
    returnStep3: 'Our team will provide you with return instructions',
    returnStep4: 'Once received and verified, we will process the refund',
    refundProcess: 'Refund Process',
    refundProcessDescription: 'The refund will be processed within 5-7 business days once we receive the returned product. The refund will be made using the same payment method used.',
    
    // FAQ Page
    faqTitle: 'Frequently Asked Questions',
    faq: 'FAQ',
    faqDescription: 'Find answers to the most common questions about our products, shipping, returns and more.',
    faq1Question: 'How can I place an order?',
    faq1Answer: 'You can place an order by adding products to your cart and completing the checkout process through WhatsApp. You just need to provide your name, phone number, and address.',
    faq2Question: 'What payment methods are accepted?',
    faq2Answer: 'We accept payments via bank transfer, cash on delivery, and other methods agreed upon via WhatsApp.',
    faq3Question: 'How long does shipping take?',
    faq3Answer: 'Shipping time depends on your location. Standard shipping: 2-4 business days. Express shipping: 1-2 business days. You can see more details on our Shipping Information page.',
    faq4Question: 'Do you offer warranty on products?',
    faq4Answer: 'Yes, all our products come with manufacturer warranty. If you experience any issues, contact us and we will help you.',
    faq5Question: 'Can I cancel my order?',
    faq5Answer: 'You can cancel your order by contacting us before it is shipped. Once shipped, our return policies apply.',
    faq6Question: 'How can I track my order?',
    faq6Answer: 'Once your order is processed, you will receive tracking information via email or WhatsApp so you can track your shipment.',
    
    // Privacy Page
    privacyTitle: 'Privacy Policy',
    lastUpdated: 'Last updated',
    privacyIntroduction: 'Introduction',
    privacyIntroductionText: 'At IsaStore, we are committed to protecting your privacy and personal data. This policy explains how we collect, use, and protect your information.',
    informationWeCollect: 'Information We Collect',
    informationWeCollectDescription: 'We collect the following information when you make a purchase:',
    infoCollected1: 'Full name',
    infoCollected2: 'Phone number',
    infoCollected3: 'Delivery address',
    infoCollected4: 'Order information (purchase history)',
    howWeUseInfo: 'How We Use Your Information',
    howWeUseInfoDescription: 'We use your information to:',
    useInfo1: 'Process and complete your orders',
    useInfo2: 'Communicate with you about your order',
    useInfo3: 'Provide customer service and support',
    useInfo4: 'Improve our products and services',
    dataProtection: 'Data Protection',
    dataProtectionDescription: 'We implement technical and organizational security measures to protect your personal information. We do not share your data with third parties without your consent, except when necessary to comply with the law.',
    contactPrivacy: 'Contact Us About Privacy',
    contactPrivacyText: 'If you have questions about our privacy policy or your personal data, contact us at:',
    
    // Terms Page
    termsTitle: 'Terms of Service',
    termsAcceptance: 'Acceptance of Terms',
    termsAcceptanceText: 'By using our website and making a purchase, you accept these terms of service. If you do not agree, please do not use our service.',
    useOfService: 'Use of Service',
    useOfServiceDescription: 'By using our service, you agree to:',
    useService1: 'Provide accurate and up-to-date information',
    useService2: 'Use the service only for legal purposes',
    useService3: 'Not attempt unauthorized access to our systems',
    useService4: 'Respect intellectual property rights',
    ordersAndPayment: 'Orders and Payment',
    ordersAndPaymentDescription: 'All orders are subject to stock availability. Prices may change without notice. Payment must be completed according to the terms agreed upon when placing the order.',
    productAvailability: 'Product Availability',
    productAvailabilityDescription: 'We do our best to keep our inventory updated. If a product is not available, we will contact you to offer alternatives or refund your payment.',
    limitationOfLiability: 'Limitation of Liability',
    limitationOfLiabilityDescription: 'IsaStore will not be liable for indirect, incidental, or consequential damages arising from the use of our products or services, beyond the value of the purchased product.',
    contactTerms: 'Contact Us About Terms',
    contactTermsText: 'If you have questions about these terms of service, contact us at:'
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
