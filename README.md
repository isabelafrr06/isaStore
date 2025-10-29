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

- **Ruby 3.4.7** - If you don't have it installed, use rbenv
- **PostgreSQL 16** - See backend README for setup instructions
- **Node.js** (for the frontend)
- **Bundler** gem - `gem install bundler`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd isa_store_backend
```

2. Install dependencies:
```bash
bundle install
```

3. Set up the database:
```bash
rails db:create
rails db:migrate
rails db:seed
```

4. Run the server:
```bash
rails server -p 3001
```

The backend API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd isa_store_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Features

- **Products**: Browse and view product details
- **Shopping Cart**: Add items, update quantities, and remove items
- **Orders**: View order history
- **Modern UI**: Beautiful, responsive design
- **RESTful API**: Clean API endpoints for all operations

## Tech Stack

- **Backend**: Ruby on Rails 7.1, PostgreSQL
- **Frontend**: React, React Router
- **Styling**: CSS3 with modern gradients and animations
- **Build Tool**: Vite

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/cart` - Get cart contents
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `PUT /api/cart/update/:id` - Update cart item quantity
- `DELETE /api/cart/clear` - Clear cart
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order

## Data Storage

The backend uses PostgreSQL database with the following tables:
- `products` - Product catalog
- `cart_items` - Shopping cart items
- `orders` - Order history
- `order_items` - Order line items
- `admins` - Admin users

See [isa_store_backend/README.md](./isa_store_backend/README.md) for PostgreSQL setup instructions.
