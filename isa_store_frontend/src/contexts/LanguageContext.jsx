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
    adminLogin: 'Iniciar Sesión',
    
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
    calculatedAtCheckout: 'Se calcula en el checkout',
    bulkDiscount: 'Descuento por Volumen',
    bulkDiscountApplied: '🎉 ¡Descuento del {percent}% aplicado por comprar {quantity}+ artículos!',
    buyXAndSave: 'Compra {quantity}+ y ahorra {percent}%',
    savePercent: 'Ahorra {percent}%',
    discountAppliedForQuantity: 'Descuento del {percent}% aplicado por comprar {quantity} artículos',
    total: 'Total',
    checkout: 'Finalizar Compra',
    clearCart: 'Vaciar Carrito',
    
    // Categories
    allProducts: 'Todos los Productos',
    more: 'más',
    showLess: 'Ver menos',
    chargers: 'Cargadores',
    laptops: 'Laptops',
    ipads: 'iPads',
    accessories: 'Accesorios',
    other: 'Otros',
    noCategories: 'No hay categorías disponibles',
    
    // Sorting
    sortBy: 'Ordenar por',
    priceAsc: 'Precio: Menor a Mayor',
    priceDesc: 'Precio: Mayor a Menor',
    nameAsc: 'Nombre: A-Z',
    nameDesc: 'Nombre: Z-A',
    newest: 'Más Recientes',
    oldest: 'Más Antiguos',
    
    // Condition
    condition: 'Condición',
    new: 'Nuevo',
    used: 'Usado',
    allConditions: 'Todas las Condiciones',
    
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
    unavailable: 'no disponible',
    outOfStock: 'Agotado',
    productOutOfStock: 'Este producto está agotado',
    notEnoughStock: 'No hay suficiente stock disponible',
    
    // About
    aboutTitle: 'Acerca de IsaStore',
    ourStory: 'Nuestra Historia',
    ourStoryText: 'Bienvenido a IsaStore, tu destino principal para electrónicos de alta calidad y accesorios tecnológicos. Fundada con pasión por la tecnología e innovación, hemos estado sirviendo a nuestros clientes con los últimos gadgets y accesorios confiables desde nuestros inicios.',
    ourMission: 'Nuestra Misión',
    ourMissionText: 'Creemos que la tecnología debe mejorar tu vida, no complicarla. Por eso seleccionamos cuidadosamente nuestros productos para traerte solo lo mejor, los electrónicos y accesorios más confiables que ofrecen gran valor por tu dinero.',
    whatWeOffer: 'Lo que Ofrecemos',
    whyChooseUs: '¿Por qué Elegirnos?',
    fastShipping: '🚚 Envío Rápido',
    fastShippingText: 'Entrega rápida y confiable a tu puerta',
    qualityGuarantee: '🛡️ Garantía de Calidad',
    qualityGuaranteeText: 'Todos los productos vienen con garantía',
    support247: '💬 Soporte 24/7',
    support247Text: 'Nuestro equipo está aquí para ayudarte en cualquier momento',
    bestPrices: '💰 Mejores Precios',
    bestPricesText: 'Precios competitivos sin comprometer la calidad',
    contactUs: 'Contáctanos',
    contactUsText: '¿Tienes preguntas o necesitas asistencia? ¡Estamos aquí para ayudarte! Comunícate con nosotros a través de nuestros canales de contacto o visita nuestra tienda para un servicio personalizado.',
    contactEmail: 'Email: isastoretech@gmail.com',
    contactPhone: 'Teléfono: +506 83047863',
    contactAddress: 'Dirección: Belén, Heredia, Costa Rica',
    storeAddress: 'Belén, Heredia, Costa Rica',
    storeEmail: 'isastoretech@gmail.com',
    storePhone: '+506 83047863',
    openInGoogleMaps: 'Google Maps',
    openInWaze: 'Abrir en Waze',
    
    // Footer
    footerDescription: 'Electrónicos de alta calidad y accesorios tecnológicos.',
    quickLinks: 'Enlaces Rápidos',
    support: 'Soporte',
    contactInfo: 'Información de Contacto',
    whatsappUs: 'Escríbenos por WhatsApp',
    whatsAppGreeting: 'Hola, me gustaría obtener más información sobre sus productos.',
    privacyPolicy: 'Política de Privacidad',
    termsOfService: 'Términos de Servicio',
    allRightsReserved: 'Todos los derechos reservados',
    
    // Admin
    adminDashboard: 'Panel de Administración',
    welcomeAdmin: 'Bienvenido',
    changePassword: 'Cambiar Contraseña',
    addNewProduct: 'Agregar Nuevo Producto',
    editProduct: 'Editar Producto',
    cancel: 'Cancelar',
    hideFromMainPage: 'Ocultar de la página principal',
    saveProduct: 'Guardar Producto',
    edit: 'Editar',
    delete: 'Eliminar',
    productName: 'Nombre del Producto',
    price: 'Precio',
    description: 'Descripción',
    category: 'Categoría',
    selectCategory: 'Selecciona una categoría',
    images: 'Imágenes',
    enterImageFilename: 'O ingresa nombre del archivo de imagen',
    existingImages: 'Imágenes existentes:',
    weight: 'Peso (kg)',
    manageCategories: 'Gestionar Categorías',
    hideCategories: 'Ocultar Categorías',
    manageDiscounts: 'Gestionar Descuentos',
    hideDiscounts: 'Ocultar Descuentos',
    discountManager: 'Gestor de Descuentos',
    addDiscountTier: 'Agregar Nivel de Descuento',
    editDiscountTier: 'Editar Nivel de Descuento',
    minQuantity: 'Cantidad Mínima',
    discountPercent: 'Porcentaje de Descuento',
    active: 'Activo',
    inactive: 'Inactivo',
    status: 'Estado',
    actions: 'Acciones',
    create: 'Crear',
    update: 'Actualizar',
    items: 'artículos',
    noDiscountTiers: 'No hay niveles de descuento configurados',
    confirmDeleteDiscountTier: '¿Estás seguro de que deseas eliminar el descuento de {percent}% para {quantity}+ artículos?',
    loadingDiscounts: 'Cargando descuentos...',
    
    // Breadcrumb
    details: 'Detalles',
    product: 'Producto',
    products: 'Productos',
    noProducts: 'No hay productos',
    
    // Orders
    myOrders: 'Mis Pedidos',
    loadingOrders: 'Cargando pedidos...',
    noOrdersYet: 'Aún no hay ningún pedido',
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
    phone8Digits: '8 dígitos',
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
    contactDescription: 'Estamos aquí para ayudarte. Si tienes alguna pregunta, comentario o necesitas asistencia, no dudes en contactarnos a través de cualquiera de nuestros canales.',
    whatsapp: 'WhatsApp',
    
    // Shipping Page
    shippingTitle: 'Información de Envío',
    shippingMethods: 'Métodos de Envío',
    shippingMethodsDescription: 'Realizamos envíos a cualquier parte del país utilizando los siguientes métodos:',
    shippingMethod1: '📮 Correos de Costa Rica - Envíos a todo el país (2 a 4 días hábiles)',
    shippingMethod2: '🚗 Uber Flash - Cotización disponible dentro del GAM (Gran Área Metropolitana) - Mismo día',
    pickupOption: '📍 Recogida en tienda - Belén (Puedes pagar al momento de recoger)',
    pickupTitle: 'Recogida en Tienda',
    pickupDescription: 'También puedes venir a recoger tu pedido directamente en nuestra ubicación en Belén. Si eliges esta opción, puedes pagar al momento de la recogida.',
    paymentMethods: 'Métodos de Pago',
    paymentMethodsDescription: 'Aceptamos los siguientes métodos de pago:',
    paymentMethod1: '💳 SINPE',
    paymentMethod2: '🏦 Transferencia bancaria',
    paymentMethod3: '💵 Efectivo',
    paymentNote: '⚠️ IMPORTANTE: Para envíos por correo o Uber Flash, el pago debe completarse antes del envío. Si recoges en tienda, puedes pagar al momento de la recogida.',
    warranty: 'Garantía',
    warrantyDescription: 'Todos nuestros productos vienen con garantía según el tipo de artículo:',
    warrantyUsed: '📦 Artículos usados: 1 mes de garantía',
    warrantyNew: '✨ Artículos nuevos: 3 meses de garantía',
    shippingInfo: 'Información de Envío',
    shippingMethod: 'Método de Envío',
    shippingPickup: 'Recogida en Tienda (Belén)',
    shippingCorreos: 'Correos de Costa Rica',
    shippingUber: 'Uber Flash',
    requestPriceWhatsApp: 'Solicitar precio por WhatsApp',
    shippingCorreosInfo: 'Peso total: {weight} kg - Costo: ₡{cost}',
    shippingUberInfo: 'El precio de envío se cotizará y confirmará por WhatsApp',
    freeShippingConditions: '💡 Envío puede ser GRATIS en GAM para pedidos sobre ₡75,000. Condiciones aplican.',
    
    // Returns Page
    returnsTitle: 'Política de Devoluciones',
    returns: 'Devoluciones',
    returnPolicy: 'Política de Devoluciones',
    returnPolicyDescription: 'Queremos que estés completamente satisfecho con tu compra. Si no estás contento con tu producto, puedes devolverlo siguiendo nuestra política de devoluciones.',
    returnPeriod: 'Período de Devolución',
    returnPeriodDescription: '⚠️ Las devoluciones se aceptan en un plazo máximo de 48 horas después de la compra.',
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
    refundProcessDescription: 'El reembolso se realiza inmediatamente al recibir y revisar el artículo devuelto. El reembolso se realizará mediante el mismo método de pago utilizado.',
    
    // FAQ Page
    faqTitle: 'Preguntas Frecuentes',
    faq: 'Preguntas Frecuentes',
    faqDescription: 'Encuentra respuestas a las preguntas más comunes sobre nuestros productos, envíos, devoluciones y más.',
    faq1Question: '¿Cómo puedo realizar un pedido?',
    faq1Answer: 'Puedes realizar un pedido agregando productos al carrito desde nuestra página web y completando el proceso de compra a través de WhatsApp. Solo necesitas proporcionar tu nombre completo, teléfono (8 dígitos) y dirección. Una vez que confirmes tu pedido por WhatsApp, procederemos con el envío.',
    faq2Question: '¿Cuáles son los métodos de pago aceptados?',
    faq2Answer: 'Aceptamos los siguientes métodos de pago: SINPE, transferencia bancaria y efectivo. Es importante mencionar que NO se envían productos que no se hayan pagado. El pago debe completarse antes del envío.',
    faq3Question: '¿Cuáles son las opciones de envío disponibles?',
    faq3Answer: 'Ofrecemos tres opciones: 1) Envíos por Correos de Costa Rica a cualquier parte del país, 2) Uber Flash para cotización dentro del GAM (Gran Área Metropolitana), y 3) Puedes venir a recoger tu pedido directamente en nuestra ubicación en Belén.',
    faq4Question: '¿Cuánto tiempo tengo para devolver un producto?',
    faq4Answer: 'Las devoluciones se aceptan en un plazo máximo de 48 horas después de la compra. El producto debe estar en su empaque original sin abrir, incluir todos los accesorios y documentación, y no debe tener signos de uso o daño.',
    faq5Question: '¿Qué garantía ofrecen los productos?',
    faq5Answer: 'Todos nuestros productos vienen con garantía según el tipo de artículo: Artículos usados tienen 1 mes de garantía y artículos nuevos tienen 3 meses de garantía.',
    faq6Question: '¿Puedo pagar al momento de recibir el pedido?',
    faq6Answer: 'Para envíos por correo o Uber Flash, el pago debe completarse antes del envío. Sin embargo, si vienes a recoger tu pedido en nuestra tienda en Belén, puedes pagar al momento de la recogida.',
    
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
    contactTermsText: 'Si tienes preguntas sobre estos términos de servicio, contáctanos en:',

    // Admin - Password
    currentPassword: 'Contraseña Actual',
    newPassword: 'Nueva Contraseña',
    confirmNewPassword: 'Confirmar Nueva Contraseña',
    passwordChangedSuccess: 'Contraseña cambiada exitosamente',
    errorChangingPassword: 'Error al cambiar la contraseña',
    confirmDeleteProduct: '¿Estás seguro de que deseas eliminar este producto?',

    // Category Manager
    categoryManagement: 'Gestión de Categorías',
    addCategory: 'Agregar Categoría',
    editCategory: 'Editar Categoría',
    addNewCategory: 'Agregar Nueva Categoría',
    categoryIdPlaceholder: 'ID de Categoría (ej., Laptops)',
    englishName: 'Nombre en Inglés',
    spanishName: 'Nombre en Español',
    categoryId: 'ID de Categoría',
    errorSavingCategory: 'Error al guardar categoría',
    cannotDeleteCategory: 'No se puede eliminar "{name}" porque tiene {count} producto(s). Reasigna o elimina los productos primero.',
    confirmDeleteCategory: '¿Estás seguro de que deseas eliminar "{name}"?',
    errorDeletingCategory: 'Error al eliminar categoría',

    // Discount Manager - errors
    errorSavingDiscount: 'Error al guardar nivel de descuento',
    errorDeletingDiscount: 'Error al eliminar nivel de descuento',

    // Confirm clear cart
    confirmClearCart: '¿Estás seguro de que deseas vaciar el carrito?',

    // Error Boundary
    errorBoundaryTitle: 'Algo salió mal',
    errorBoundaryMessage: 'Ocurrió un error inesperado. Por favor recarga la página.',
    errorBoundaryReload: 'Recargar Página',

    // Free server banner
    freeServerBanner: 'Este sitio usa un servidor gratuito. Los productos pueden tardar ~10 segundos en cargar. Si no cargan, recarga la página manualmente.',
    freeServerError: 'No se pudo conectar con el servidor. Este sitio usa un servidor gratuito que puede estar inactivo. Por favor, recarga la página en unos segundos.',
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    cart: 'Cart',
    orders: 'Orders',
    adminPanel: 'Admin Dashboard',
    logout: 'Logout',
    adminLogin: 'Login',
    
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
    calculatedAtCheckout: 'Calculated at checkout',
    bulkDiscount: 'Bulk Discount',
    bulkDiscountApplied: '🎉 {percent}% discount applied for buying {quantity}+ items!',
    buyXAndSave: 'Buy {quantity}+ and save {percent}%',
    savePercent: 'Save {percent}%',
    discountAppliedForQuantity: '{percent}% discount applied for buying {quantity} items',
    total: 'Total',
    checkout: 'Checkout',
    clearCart: 'Clear Cart',
    
    // Categories
    allProducts: 'All Products',
    more: 'more',
    showLess: 'Show less',
    chargers: 'Chargers',
    laptops: 'Laptops',
    ipads: 'iPads',
    accessories: 'Accessories',
    other: 'Other',
    noCategories: 'No categories available',
    
    // Sorting
    sortBy: 'Sort by',
    priceAsc: 'Price: Low to High',
    priceDesc: 'Price: High to Low',
    nameAsc: 'Name: A-Z',
    nameDesc: 'Name: Z-A',
    newest: 'Newest First',
    oldest: 'Oldest First',
    
    // Condition
    condition: 'Condition',
    new: 'New',
    used: 'Used',
    allConditions: 'All Conditions',
    
    // Product Detail
    loadingProduct: 'Loading product...',
    productNotFound: 'Product not found',
    backToProducts: '← Back to Products',
    quantity: 'Quantity',
    addToCart: 'Add to Cart',
    productAddedToCart: 'Product added to cart!',
    errorAddingToCart: 'Error adding product to cart',
    unavailable: 'unavailable',
    outOfStock: 'Out of Stock',
    productOutOfStock: 'This product is out of stock',
    notEnoughStock: 'Not enough stock available',
    available: 'available',
    
    // About
    aboutTitle: 'About IsaStore',
    ourStory: 'Our Story',
    ourStoryText: 'Welcome to IsaStore, your premier destination for high-quality electronics and tech accessories. Founded with a passion for technology and innovation, we have been serving our customers with the latest gadgets and reliable accessories since our inception.',
    ourMission: 'Our Mission',
    ourMissionText: 'We believe technology should enhance your life, not complicate it. That\'s why we carefully curate our products to bring you only the best, the most reliable electronics and accessories that offer great value for your money.',
    whatWeOffer: 'What We Offer',
    whyChooseUs: 'Why Choose Us?',
    fastShipping: '🚚 Fast Shipping',
    fastShippingText: 'Quick and reliable delivery to your door',
    qualityGuarantee: '🛡️ Quality Guarantee',
    qualityGuaranteeText: 'All products come with warranty',
    support247: '💬 24/7 Support',
    support247Text: 'Our team is here to help you anytime',
    bestPrices: '💰 Best Prices',
    bestPricesText: 'Competitive prices without compromising quality',
    contactUs: 'Contact Us',
    contactUsText: 'Have questions or need assistance? We\'re here to help! Reach out through our contact channels or visit our store for personalized service.',
    contactEmail: '📧 Email: isastoretech@gmail.com',
    contactPhone: '📞 Phone: +506 83047863',
    contactAddress: 'Address: Belén, Heredia, Costa Rica',
    storeAddress: 'Belén, Heredia, Costa Rica',
    storeEmail: 'isastoretech@gmail.com',
    storePhone: '+506 83047863',
    openInGoogleMaps: 'Google Maps',
    openInWaze: 'Open in Waze',
    
    // Footer
    footerDescription: 'High-quality electronics and tech accessories.',
    quickLinks: 'Quick Links',
    support: 'Support',
    contactInfo: 'Contact Info',
    whatsappUs: 'WhatsApp Us',
    whatsAppGreeting: 'Hello, I would like to get more information about your products.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    allRightsReserved: 'All rights reserved',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    welcomeAdmin: 'Welcome',
    changePassword: 'Change Password',
    addNewProduct: 'Add New Product',
    editProduct: 'Edit Product',
    cancel: 'Cancel',
    hideFromMainPage: 'Hide from main page',
    saveProduct: 'Save Product',
    edit: 'Edit',
    delete: 'Delete',
    productName: 'Product Name',
    price: 'Price',
    description: 'Description',
    category: 'Category',
    selectCategory: 'Select a category',
    images: 'Images',
    enterImageFilename: 'Or enter image filename',
    existingImages: 'Existing images:',
    weight: 'Weight (kg)',
    manageCategories: 'Manage Categories',
    hideCategories: 'Hide Categories',
    manageDiscounts: 'Manage Discounts',
    hideDiscounts: 'Hide Discounts',
    discountManager: 'Discount Manager',
    addDiscountTier: 'Add Discount Tier',
    editDiscountTier: 'Edit Discount Tier',
    minQuantity: 'Minimum Quantity',
    discountPercent: 'Discount Percent',
    active: 'Active',
    inactive: 'Inactive',
    status: 'Status',
    actions: 'Actions',
    create: 'Create',
    update: 'Update',
    items: 'items',
    noDiscountTiers: 'No discount tiers configured',
    confirmDeleteDiscountTier: 'Are you sure you want to delete the {percent}% discount for {quantity}+ items?',
    loadingDiscounts: 'Loading discounts...',
    
    // Breadcrumb
    details: 'Details',
    product: 'Product',
    products: 'Products',
    noProducts: 'No products',
    
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
    phone8Digits: '8 digits',
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
    contactDescription: 'We are here to help you. If you have any questions, comments, or need assistance, don\'t hesitate to contact us through any of our channels.',
    whatsapp: 'WhatsApp',
    
    // Shipping Page
    shippingTitle: 'Shipping Information',
    shippingMethods: 'Shipping Methods',
    shippingMethodsDescription: 'We ship to anywhere in the country using the following methods:',
    shippingMethod1: '📮 Correos de Costa Rica - Shipping nationwide (2 to 4 business days)',
    shippingMethod2: '🚗 Uber Flash - Quote available within GAM (Greater Metropolitan Area) - Same day',
    pickupOption: '📍 Store Pickup - Belén (You can pay at pickup)',
    pickupTitle: 'Store Pickup',
    pickupDescription: 'You can also come pick up your order directly at our location in Belén. If you choose this option, you can pay at the time of pickup.',
    paymentMethods: 'Payment Methods',
    paymentMethodsDescription: 'We accept the following payment methods:',
    paymentMethod1: '💳 SINPE',
    paymentMethod2: '🏦 Bank transfer',
    paymentMethod3: '💵 Cash',
    paymentNote: '⚠️ IMPORTANT: For shipments via mail or Uber Flash, payment must be completed before shipping. If you pick up in store, you can pay at the time of pickup.',
    warranty: 'Warranty',
    warrantyDescription: 'All our products come with warranty according to the type of item:',
    warrantyUsed: '📦 Used items: 1 month warranty',
    warrantyNew: '✨ New items: 3 months warranty',
    shippingInfo: 'Shipping Information',
    shippingMethod: 'Shipping Method',
    shippingPickup: 'Store Pickup (Belén)',
    shippingCorreos: 'Correos de Costa Rica',
    shippingUber: 'Uber Flash',
    requestPriceWhatsApp: 'Request price via WhatsApp',
    shippingCorreosInfo: 'Total weight: {weight} kg - Cost: ₡{cost}',
    shippingUberInfo: 'Shipping price will be quoted and confirmed via WhatsApp',
    freeShippingConditions: '💡 Delivery may be FREE in GAM for orders over ₡75,000. Conditions apply.',
    
    // Returns Page
    returnsTitle: 'Returns Policy',
    returns: 'Returns',
    returnPolicy: 'Returns Policy',
    returnPolicyDescription: 'We want you to be completely satisfied with your purchase. If you are not happy with your product, you can return it following our returns policy.',
    returnPeriod: 'Return Period',
    returnPeriodDescription: '⚠️ Returns are accepted within a maximum period of 48 hours after purchase.',
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
    refundProcessDescription: 'The refund is processed immediately upon receiving and reviewing the returned item. The refund will be made using the same payment method used.',
    
    // FAQ Page
    faqTitle: 'Frequently Asked Questions',
    faq: 'FAQ',
    faqDescription: 'Find answers to the most common questions about our products, shipping, returns and more.',
    faq1Question: 'How can I place an order?',
    faq1Answer: 'You can place an order by adding products to your cart from our website and completing the checkout process through WhatsApp. You just need to provide your full name, phone number (8 digits), and address. Once you confirm your order via WhatsApp, we will proceed with shipping.',
    faq2Question: 'What payment methods are accepted?',
    faq2Answer: 'We accept the following payment methods: SINPE, bank transfer, and cash. It is important to note that products are NOT shipped until paid. Payment must be completed before shipping.',
    faq3Question: 'What shipping options are available?',
    faq3Answer: 'We offer three options: 1) Shipping via Correos de Costa Rica anywhere in the country, 2) Uber Flash for quotes within GAM (Greater Metropolitan Area), and 3) You can pick up your order directly at our location in Belén.',
    faq4Question: 'How long do I have to return a product?',
    faq4Answer: 'Returns are accepted within a maximum period of 48 hours after purchase. The product must be in its original unopened packaging, include all accessories and documentation, and must not show signs of use or damage.',
    faq5Question: 'What warranty do you offer on products?',
    faq5Answer: 'All our products come with warranty according to the type of item: Used items have 1 month warranty and new items have 3 months warranty.',
    faq6Question: 'Can I pay when I receive the order?',
    faq6Answer: 'For shipments via mail or Uber Flash, payment must be completed before shipping. However, if you come to pick up your order at our store in Belén, you can pay at the time of pickup.',
    
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
    contactTermsText: 'If you have questions about these terms of service, contact us at:',

    // Admin - Password
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    passwordChangedSuccess: 'Password changed successfully',
    errorChangingPassword: 'Error changing password',
    confirmDeleteProduct: 'Are you sure you want to delete this product?',

    // Category Manager
    categoryManagement: 'Category Management',
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    addNewCategory: 'Add New Category',
    categoryIdPlaceholder: 'Category ID (e.g., Laptops)',
    englishName: 'English Name',
    spanishName: 'Spanish Name',
    categoryId: 'Category ID',
    errorSavingCategory: 'Error saving category',
    cannotDeleteCategory: 'Cannot delete "{name}" because it has {count} product(s). Please reassign or delete the products first.',
    confirmDeleteCategory: 'Are you sure you want to delete "{name}"?',
    errorDeletingCategory: 'Error deleting category',

    // Discount Manager - errors
    errorSavingDiscount: 'Error saving discount tier',
    errorDeletingDiscount: 'Error deleting discount tier',

    // Confirm clear cart
    confirmClearCart: 'Are you sure you want to clear the cart?',

    // Error Boundary
    errorBoundaryTitle: 'Something went wrong',
    errorBoundaryMessage: 'An unexpected error occurred. Please reload the page.',
    errorBoundaryReload: 'Reload Page',

    // Free server banner
    freeServerBanner: 'This site uses a free server. Products may take ~10 seconds to load. If they don\'t load, please reload the page manually.',
    freeServerError: 'Could not connect to the server. This site uses a free server that may be inactive. Please reload the page in a few seconds.',
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es') // Default to Spanish
  
  const t = (key, params = {}) => {
    try {
      if (!key) return ''
      if (!translations[language]) {
        console.warn(`Language '${language}' not found, defaulting to 'es'`)
        return translations['es'][key] || key
      }
      let translation = translations[language][key] || translations['es'][key] || key
      
      // Handle interpolation with params
      if (params && Object.keys(params).length > 0) {
        Object.keys(params).forEach(param => {
          translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param])
        })
      }
      
      return translation
    } catch (error) {
      console.error('Translation error:', error, 'key:', key, 'language:', language)
      return key
    }
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
