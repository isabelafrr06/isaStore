#!/bin/bash
set -e

# Run migrations and seed
bundle exec rails db:migrate
bundle exec rails db:seed

# Start the server
exec bundle exec puma -C config/puma.rb

