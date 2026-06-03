# Only seed if running in development or if SEED_DATABASE environment variable is set
# In production, don't destroy existing data - only create missing items
should_seed = Rails.env.development? || ENV['SEED_DATABASE'] == 'true'

unless should_seed
  puts "Skipping database seeding (set SEED_DATABASE=true to force seeding in production)"
  exit
end

# Only clear data in development, not production
if Rails.env.development?
  Product.destroy_all
  CartItem.destroy_all
  Order.destroy_all
  OrderItem.destroy_all
end

# Ensure categories exist (they should be created by migration, but ensure they exist)
categories_data = [
  { name: 'Chargers', name_en: 'Chargers', name_es: 'Cargadores', position: 1 },
  { name: 'Laptops', name_en: 'Laptops', name_es: 'Laptops', position: 2 },
  { name: 'iPads', name_en: 'iPads', name_es: 'iPads', position: 3 },
  { name: 'Accessories', name_en: 'Accessories', name_es: 'Accesorios', position: 4 },
  { name: 'Other', name_en: 'Other', name_es: 'Otros', position: 5 }
]

categories_data.each do |cat_data|
  Category.find_or_create_by(name: cat_data[:name]) do |category|
    category.name_en = cat_data[:name_en]
    category.name_es = cat_data[:name_es]
    category.position = cat_data[:position]
  end
end

puts "Ensured #{Category.count} categories exist"

# Create sample products (only if they don't exist)
products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    price: 15000,
    image: 'sample-product.jpg',
    stock: 50,
    category: 'Accessories',
    condition: 'new',
    weight: 0.3
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 100000,
    image: 'smart-watch.jpg',
    stock: 30,
    category: 'Accessories',
    condition: 'new',
    weight: 0.2
  },
  {
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand',
    price: 5000,
    image: 'laptop-stand.jpg',
    stock: 10,
    category: 'Accessories',
    condition: 'new',
    weight: 1.2
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 7000,
    image: 'keyboard.jpg',
    stock: 1,
    category: 'Accessories',
    condition: 'new',
    weight: 0.8
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI and USB 3.0',
    price: 20000,
    image: 'usb-hub.jpg',
    stock: 20,
    category: 'Accessories',
    condition: 'new',
    weight: 0.1
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life',
    price: 5000,
    image: 'mouse.jpg',
    stock: 15,
    category: 'Accessories',
    condition: 'new',
    weight: 0.1
  }
]

products.each do |product_data|
  # Only create if product doesn't exist (check by name)
  product = Product.find_or_create_by(name: product_data[:name]) do |p|
    p.description = product_data[:description]
    p.price = product_data[:price]
    p.image = product_data[:image]
    p.stock = product_data[:stock]
    p.category = product_data[:category]
    p.condition = product_data[:condition]
    p.weight = product_data[:weight]
  end
  
  # Update category if product already exists but doesn't have one
  if product.persisted? && product.category.blank?
    product.update(category: product_data[:category])
  end
end

puts "Created #{Product.count} products"

# Create default discount tiers (only if they don't exist)
discount_tiers = [
  { min_quantity: 10, discount_percent: 20.0 },
  { min_quantity: 5, discount_percent: 15.0 },
  { min_quantity: 3, discount_percent: 10.0 },
  { min_quantity: 2, discount_percent: 5.0 }
]

discount_tiers.each do |tier_data|
  DiscountTier.find_or_create_by(min_quantity: tier_data[:min_quantity]) do |tier|
    tier.discount_percent = tier_data[:discount_percent]
    tier.active = true
  end
end

puts "Created #{DiscountTier.count} discount tiers"

# Create default admin (uses environment variable for password)
admin_email = ENV.fetch('ADMIN_EMAIL', 'admin@isastore.com').strip.downcase
admin_password = if Rails.env.development?
  ENV.fetch('ADMIN_PASSWORD', 'dev_password_local_only')
else
  ENV.fetch('ADMIN_PASSWORD') { raise 'ADMIN_PASSWORD must be set in production' }
end
admin_name = ENV.fetch('ADMIN_NAME', 'Admin User')

# Normalize email to lowercase for consistent lookup
admin = Admin.find_or_create_by(email: admin_email) do |a|
  a.name = admin_name
  a.password = admin_password
  a.password_confirmation = admin_password
end

# Update password if admin already exists (ensures password syncs with environment variable)
if admin.persisted?
  # Always update name
  admin.name = admin_name
  
  # Force password update by setting it directly (bypasses has_secure_password's "no change" optimization)
  admin.password = admin_password
  admin.password_confirmation = admin_password
  
  # Save will update password_digest if password changed
  if admin.save
    puts "Created/updated admin user with email: #{admin.email}"
  else
    puts "ERROR: Failed to update admin user: #{admin.errors.full_messages.join(', ')}"
  end
end

# Seed service pricings (only if table is empty)
if ServicePricing.count == 0
  service_pricings = [
    { name_es: 'Landing page estática (1 página)',              name_en: 'Static landing page (1 page)',           price: '₡50.000 – ₡80.000',          position: 1 },
    { name_es: 'Sitio web básico (3-5 secciones)',              name_en: 'Basic website (3-5 sections)',           price: '₡80.000 – ₡150.000',         position: 2 },
    { name_es: 'Portafolio profesional',                        name_en: 'Professional portfolio',                 price: '₡100.000 – ₡180.000',        position: 3 },
    { name_es: 'Página para artista (galería, contacto, obras)',name_en: 'Artist page (gallery, contact, works)',  price: '₡120.000 – ₡250.000',        position: 4 },
    { name_es: 'Catálogo de productos sin pagos',               name_en: 'Product catalog (no payments)',          price: '₡150.000 – ₡300.000',        position: 5 },
    { name_es: 'Blog con CMS (WordPress, etc.)',                name_en: 'Blog with CMS (WordPress, etc.)',        price: '₡150.000 – ₡350.000',        position: 6 },
    { name_es: 'Tienda en línea básica',                        name_en: 'Basic online store',                     price: '₡300.000 – ₡600.000',        position: 7 },
    { name_es: 'Sistema de reservas (citas)',                   name_en: 'Booking/appointment system',             price: '₡400.000 – ₡800.000',        position: 8 },
    { name_es: 'Aplicación web CRUD (usuarios, login, panel)', name_en: 'CRUD web app (users, login, panel)',     price: '₡500.000 – ₡1.000.000',      position: 9 },
    { name_es: 'SaaS/MVP para startup',                         name_en: 'SaaS/MVP for startup',                   price: '₡1.000.000 – ₡3.000.000',    position: 10 },
    { name_es: 'App móvil sencilla (React Native/Flutter)',     name_en: 'Simple mobile app (React Native/Flutter)', price: '₡800.000 – ₡2.000.000',  position: 11 },
    { name_es: 'Sistema empresarial a medida',                  name_en: 'Custom enterprise system',               price: '₡2.000.000+',                position: 12 },
  ]

  service_pricings.each { |sp| ServicePricing.create!(sp.merge(active: true)) }
  puts "Created #{ServicePricing.count} service pricings"
end

puts "Seeding completed!"
