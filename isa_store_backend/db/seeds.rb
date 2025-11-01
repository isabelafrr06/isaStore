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

# Create sample products (only if they don't exist)
products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    price: 149.99,
    image: 'sample-product.jpg',
    stock: 50
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 299.99,
    image: 'smart-watch.jpg',
    stock: 30
  },
  {
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand',
    price: 49.99,
    image: 'laptop-stand.jpg',
    stock: 100
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 89.99,
    image: 'keyboard.jpg',
    stock: 75
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI and USB 3.0',
    price: 34.99,
    image: 'usb-hub.jpg',
    stock: 200
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life',
    price: 39.99,
    image: 'mouse.jpg',
    stock: 150
  }
]

products.each do |product_data|
  # Only create if product doesn't exist (check by name)
  Product.find_or_create_by(name: product_data[:name]) do |product|
    product.description = product_data[:description]
    product.price = product_data[:price]
    product.image = product_data[:image]
    product.stock = product_data[:stock]
  end
end

puts "Created #{Product.count} products"

# Create default admin (uses environment variable for password)
admin_email = ENV.fetch('ADMIN_EMAIL', 'admin@isastore.com').strip.downcase
admin_password = ENV.fetch('ADMIN_PASSWORD', 'CHANGE_ME_IN_PRODUCTION')
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
    if admin_password == 'CHANGE_ME_IN_PRODUCTION'
      puts "Created/updated admin user with email: #{admin.email}"
      puts "⚠️  WARNING: Using default password! Set ADMIN_PASSWORD in production!"
      puts "   Default password is: CHANGE_ME_IN_PRODUCTION"
    else
      puts "Created/updated admin user with email: #{admin.email} (password set from ADMIN_PASSWORD)"
    end
  else
    puts "ERROR: Failed to update admin user: #{admin.errors.full_messages.join(', ')}"
  end
end

puts "Seeding completed!"
