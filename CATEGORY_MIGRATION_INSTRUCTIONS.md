# Category Migration Instructions

## What's New?
Added category support to organize products by type (Chargers, Laptops, iPads, Accessories, Other).

## Database Migration Required

After deploying the backend to Railway, run this migration:

### Option 1: Using Railway CLI
```bash
railway run rails db:migrate
```

### Option 2: Using Railway Web Terminal
1. Go to your Railway project
2. Click on your backend service
3. Go to "Deploy" tab
4. Click on the latest deployment
5. Click "View Logs" and then switch to "Terminal"
6. Run:
```bash
rails db:migrate
```

### Option 3: Connect to Railway PostgreSQL
```bash
# Get the DATABASE_URL from Railway variables
railway variables

# Run migration directly
RAILS_ENV=production DATABASE_URL="your_railway_db_url" rails db:migrate
```

## What This Migration Does
- Adds a `category` column to the `products` table
- Adds an index on `category` for better performance
- Allows filtering products by category

## Features Added

### Backend
- ✅ Category field in Product model
- ✅ Category validation (Chargers, Laptops, iPads, Accessories, Other)
- ✅ Filtering by category: `/api/products?category=Chargers`
- ✅ Get all categories: `/api/categories`

### Frontend
- ✅ Category selector in Admin Dashboard
- ✅ Category filter buttons in Product List
- ✅ Translated category names (ES/EN)
- ✅ Responsive design for category filters

## How to Use

### As Admin
1. Go to Admin Dashboard
2. When creating/editing a product, select a category from the dropdown
3. Categories help organize your inventory

### As Customer
1. Go to Products page
2. Click on category buttons to filter products
3. Click "All Products" to see everything

## Existing Products
All existing products will have `category: null` until you edit them and assign a category.

## Notes
- Category is optional (can be null)
- You can add more categories by editing:
  - Backend: `app/models/product.rb` (CATEGORIES constant)
  - Frontend: `src/components/AdminDashboard.jsx` and `src/components/ProductList.jsx`

