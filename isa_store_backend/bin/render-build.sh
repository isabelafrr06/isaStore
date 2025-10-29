#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
bundle install

# Precompile assets (skip errors if no assets to compile)
set +e
bundle exec rails assets:precompile 2>&1
bundle exec rails assets:clean 2>&1
set -e

# Run migrations
bundle exec rails db:migrate
