#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for database to be ready..."
RETRIES=30
DB_READY=0

while [ $RETRIES -gt 0 ]; do
  if bundle exec rails runner "ActiveRecord::Base.connection.execute('SELECT 1')" 2>/dev/null; then
    DB_READY=1
    break
  fi
  echo "Waiting for database... $RETRIES retries remaining"
  RETRIES=$((RETRIES-1))
  sleep 2
done

if [ $DB_READY -eq 0 ]; then
  echo "❌ Database connection failed after 60 seconds"
  exit 1
fi

echo "✅ Database is ready!"

# Run migrations only (don't seed in production automatically)
bundle exec rails db:migrate

# Only seed if explicitly requested via environment variable
if [ "$SEED_DATABASE" = "true" ]; then
  echo "Seeding database (SEED_DATABASE=true is set)..."
  bundle exec rails db:seed
else
  echo "Skipping database seeding (set SEED_DATABASE=true to enable seeding)"
fi

# Start the server
exec bundle exec puma -C config/puma.rb

