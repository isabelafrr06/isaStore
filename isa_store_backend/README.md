# IsaStore Backend

Ruby on Rails API for the IsaStore e-commerce platform.

## Prerequisites

- **Ruby 3.4.7** (check with `ruby -v`)
- **PostgreSQL** (see PostgreSQL Setup below)
- **Bundler** (`gem install bundler`)

## PostgreSQL Setup

### Installation (macOS)

1. **Install PostgreSQL:**
   ```bash
   brew install postgresql@16
   ```

2. **Start PostgreSQL:**
   ```bash
   brew services start postgresql@16
   ```

3. **Add to PATH (if needed):**
   ```bash
   echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

4. **Create databases:**
   ```bash
   # Using Rails (recommended)
   rails db:create
   
   # Or manually
   createdb isa_store_development
   createdb isa_store_test
   ```

For more detailed instructions, see [LOCAL_POSTGRES_SETUP.md](../LOCAL_POSTGRES_SETUP.md)

## Setup

1. **Install dependencies:**
```bash
bundle install
```

2. **Set up the database:**
```bash
rails db:create
rails db:migrate
rails db:seed
```

3. **Run the server:**
```bash
rails server -p 3001
```

The server will start on port 3001.

## Database

The application uses PostgreSQL for development and includes:
- Products table for the product catalog
- CartItems table for shopping cart items
- Orders table for order history
- OrderItems table for order line items
- Admins table for admin authentication

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
