# Clear existing data
Product.destroy_all
CartItem.destroy_all
Order.destroy_all
OrderItem.destroy_all

# Create sample products
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
  Product.create!(product_data)
end

puts "Created #{Product.count} products"

# Create default admin (uses environment variable for password)
admin_password = ENV.fetch('ADMIN_PASSWORD', 'CHANGE_ME_IN_PRODUCTION')
admin = Admin.find_or_create_by(email: ENV.fetch('ADMIN_EMAIL', 'admin@isastore.com')) do |a|
  a.name = ENV.fetch('ADMIN_NAME', 'Admin User')
  a.password = admin_password
end

if admin.persisted?
  puts "Created admin user with email: #{admin.email}"
  puts "⚠️  WARNING: Using default password in development. Set ADMIN_PASSWORD in production!"
end

puts "Seeding completed!"
