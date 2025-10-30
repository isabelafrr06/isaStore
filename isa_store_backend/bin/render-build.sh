#!/usr/bin/env bash
# Build script for Railway deployment

set -o errexit

# Install dependencies
bundle install

# Skip asset precompilation (API-only app)
echo "Skipping asset precompilation (API-only app)"

# Don't run migrations here - they run via Procfile release phase
echo "Migrations will run during release phase"

