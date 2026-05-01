# IsaStore - E-Commerce Platform

A full-stack web store built with Ruby on Rails and React.

## Project Structure

```
.
├── isa_store_backend/    # Ruby on Rails API backend
└── isa_store_frontend/   # React frontend
```

## Getting Started

### Prerequisites

- **Ruby 3.4.7** - use rbenv to install
- **PostgreSQL 16**
- **Node.js**
- **Bundler** — `gem install bundler`

### PostgreSQL Setup (macOS)

```bash
brew install postgresql@16
brew services start postgresql@16
# Add to PATH if needed:
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

Common commands:
```bash
brew services start postgresql@16   # start
brew services stop postgresql@16    # stop
psql postgres                        # connect
```

### Backend Setup

```bash
cd isa_store_backend
bundle install
rails db:create
rails db:migrate
rails db:seed
rails server -p 3001
```

API available at `http://localhost:3001`

### Frontend Setup

```bash
cd isa_store_frontend
npm install
npm run dev
```

Frontend available at `http://localhost:3000`

## Features

- Product browsing with category filtering
- Shopping cart (add, update, remove)
- Order history
- Admin dashboard (products, categories, discounts)
- Product reviews with Google/Facebook OAuth
- WhatsApp checkout integration
- Responsive UI

## Tech Stack

- **Backend**: Ruby on Rails 7.1, PostgreSQL
- **Frontend**: React, React Router, Vite
- **Styling**: CSS3

## API Endpoints

```
GET    /api/products            List products
GET    /api/products/:id        Single product
GET    /api/categories          List categories
GET    /api/cart                Cart contents
POST   /api/cart/add            Add to cart
PUT    /api/cart/update/:id     Update quantity
DELETE /api/cart/remove/:id     Remove item
DELETE /api/cart/clear          Clear cart
GET    /api/orders              Order history
POST   /api/orders              Create order
GET    /api/reviews             Approved reviews
POST   /api/reviews             Submit review (OAuth required)
POST   /api/admin/upload-image  Upload product image (admin)
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Railway (backend) and Vercel (frontend) deployment instructions.
