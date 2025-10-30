#!/usr/bin/env bash
# This file is kept for compatibility but not used with Railway
# Railway uses nixpacks.toml and Procfile instead

set -o errexit

# Install dependencies
bundle install

# Skip asset precompilation (API-only app)
echo "Skipping asset precompilation (API-only app)"

# Run migrations
bundle exec rails db:migrate

