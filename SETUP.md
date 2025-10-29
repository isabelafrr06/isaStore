# IsaStore Setup Guide

## Quick Start

### 1. Update Ruby Version (First Time Only)

This project requires Ruby 3.3.0. If you don't have it installed:

**Using rbenv (Recommended for macOS):**
```bash
# Install rbenv if you don't have it
brew install rbenv

# Set up rbenv in your shell
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(rbenv init -)"' >> ~/.zshrc

# Restart your terminal or run:
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

# Install Ruby 3.3.0
rbenv install 3.3.0

# Set it as the local version for this project
cd isa_store_backend
rbenv local 3.3.0

# Verify the version
ruby --version
# Should show: ruby 3.3.0
```

**Using RVM (Alternative):**
```bash
# Install Ruby 3.3.0
# Note: RVM may have issues on macOS Sequoia/Apple Silicon
# If you encounter errors, use rbenv instead
rvm install 3.3.0

# Use it for this project
cd isa_store_backend
rvm use 3.3.0
```

**Troubleshooting RVM Installation:**
If you get Homebrew errors when installing with RVM, try:
```bash
# Repair Homebrew tap
brew tap --repair
brew doctor

# Or use rbenv instead (recommended for Apple Silicon Macs)
brew install rbenv
```

### 2. Install Backend Dependencies

```bash
cd isa_store_backend

# Initialize rbenv in this terminal session (if not already done)
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

# Verify you're using Ruby 3.3.0
ruby --version
# Should show: ruby 3.3.0

# Install gems
bundle install
```

**Note:** If you get "Could not find 'bundler'" error, it means your terminal is using the system Ruby instead of rbenv's Ruby. Make sure to:
1. Run the `export` and `eval` commands above in your terminal
2. Or add these lines to your `~/.zshrc` file:
```bash
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"
```
Then restart your terminal or run `source ~/.zshrc`.

### 3. Set Up the Database

```bash
cd isa_store_backend

# Create the database
rails db:create

# Run migrations
rails db:migrate

# Seed sample data
rails db:seed
```

### 4. Start the Backend Server

```bash
cd isa_store_backend

# Initialize rbenv (if not already done)
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

# Make sure you're using the correct Ruby version
rbenv local 3.3.0
ruby -v
# Should show: ruby 3.3.0

# Start the Rails server with bundle exec
bundle exec rails server -p 3001
```

**Important:** If you get "Rails is not currently installed" error, make sure to:
1. Use the project directory: `cd isa_store_backend`
2. Use `bundle exec rails` instead of just `rails`

The backend will start on `http://localhost:3001`

### 5. Install Frontend Dependencies (in a new terminal)

```bash
cd isa_store_frontend
npm install
```

### 6. Start the Frontend Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### 7. Open in Browser

Visit `http://localhost:3000` to see IsaStore!

## Troubleshooting

### Ruby version issues
Make sure you have Ruby 3.3.0 installed. Check with:
```bash
cd isa_store_backend
ruby --version
# Should show: ruby 3.3.0
```

If you see a different version:
```bash
# Using rbenv
rbenv local 3.3.0

# Or using RVM
rvm use 3.3.0
```

### Bundle install permission issues
If you get permission errors, use:
```bash
sudo gem install bundler
```

Or install gems in your home directory:
```bash
echo 'export PATH="$HOME/.gem/ruby/3.3.0/bin:$PATH"' >> ~/.zshrc
```

### Port already in use
If port 3000 or 3001 is already in use, you can modify the ports in:
- Backend: `isa_store_backend/config/puma.rb` (line 5)
- Frontend: `isa_store_frontend/vite.config.js` (line 7)

## Features Available

✅ Browse products
✅ View product details
✅ Add items to cart
✅ Update cart quantities
✅ Remove items from cart
✅ View cart with total
✅ Place orders
✅ View order history
✅ Responsive design

