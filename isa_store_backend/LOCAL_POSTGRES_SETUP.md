# Local PostgreSQL Setup Guide

This guide will help you set up PostgreSQL for local development.

## Installation (macOS with Homebrew)

### 1. Install PostgreSQL

```bash
brew install postgresql@16
```

### 2. Start PostgreSQL Service

```bash
# Start PostgreSQL now
brew services start postgresql@16

# To check if it's running
brew services list | grep postgresql
```

### 3. Verify Installation

```bash
# Check PostgreSQL version
psql --version

# Try connecting (should work without password initially)
psql postgres
```

## Initial Setup

### Create Development Databases

After PostgreSQL is running, create your databases:

```bash
# Using Rails (recommended)
cd isa_store_backend
rails db:create

# Or manually using psql
createdb isa_store_development
createdb isa_store_test
```

### Run Migrations

```bash
cd isa_store_backend
rails db:migrate
rails db:seed
```

## Common Commands

### Starting/Stopping PostgreSQL

```bash
# Start PostgreSQL
brew services start postgresql@16

# Stop PostgreSQL
brew services stop postgresql@16

# Restart PostgreSQL
brew services restart postgresql@16

# Check status
brew services list
```

### PostgreSQL Command Line

```bash
# Connect to PostgreSQL
psql postgres

# List all databases
psql -l

# Connect to specific database
psql isa_store_development

# Exit psql
\q
```

### Useful psql Commands

Once inside `psql`:
- `\l` - List databases
- `\c database_name` - Connect to database
- `\dt` - List tables
- `\d table_name` - Describe table
- `\q` - Quit

## Troubleshooting

### Connection Refused

If you get "Connection refused" error:
```bash
# Make sure PostgreSQL is running
brew services start postgresql@16

# Check if port 5432 is in use
lsof -i :5432
```

### Permission Issues

If you get permission errors:
```bash
# Check your PostgreSQL user
whoami

# Create database with your username
createdb isa_store_development -O $(whoami)
```

### Port Already in Use

If port 5432 is already in use:
```bash
# Find what's using the port
lsof -i :5432

# Kill the process if needed
kill -9 <PID>
```

## Configuration

### Default Settings

- **Host**: localhost
- **Port**: 5432
- **User**: Your macOS username (no password by default)
- **Database**: Will be created by Rails

### Custom Configuration (if needed)

If you need to set a password or different username, update `config/database.yml`:

```yaml
development:
  <<: *default
  database: isa_store_development
  username: your_username
  password: your_password
```

## Quick Start Script

You can create a quick setup script:

```bash
#!/bin/bash
# Save as setup-db.sh

echo "Starting PostgreSQL..."
brew services start postgresql@16

echo "Waiting for PostgreSQL to start..."
sleep 2

echo "Creating databases..."
cd isa_store_backend
rails db:create
rails db:migrate
rails db:seed

echo "Done! PostgreSQL is ready."
```







