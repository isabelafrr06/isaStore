#!/bin/bash
set -e

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

