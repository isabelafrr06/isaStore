# Multi-stage Dockerfile for Rails backend
# Optimized for faster builds with layer caching

# Stage 1: Base image with system dependencies
FROM ruby:3.4.7-slim AS base

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libyaml-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Stage 2: Dependencies - Install gems (cached layer)
FROM base AS dependencies

# Copy dependency files first for better caching
COPY Gemfile Gemfile.lock ./

# Install gems without development/test groups
RUN bundle config set --local without 'development test' && \
    bundle install --jobs 4 --retry 3 && \
    rm -rf /usr/local/bundle/cache/*.gem && \
    find /usr/local/bundle/gems/ -name "*.c" -delete && \
    find /usr/local/bundle/gems/ -name "*.o" -delete

# Stage 3: Build - Copy application code
FROM dependencies AS build

# Copy application code
COPY . .

# Precompile bootsnap cache (optional, speeds up boot)
RUN bundle exec bootsnap precompile --gemfile app/ lib/

# Stage 4: Production - Final minimal image
FROM base AS production

# Copy only installed gems from dependencies stage
COPY --from=dependencies /usr/local/bundle /usr/local/bundle

# Copy application code from build stage
COPY --from=build /app /app

# Create necessary directories
RUN mkdir -p /app/tmp/pids /app/log /app/storage

# Set environment variables
ENV RAILS_ENV=production
ENV RACK_ENV=production
ENV RAILS_SERVE_STATIC_FILES=true
ENV RAILS_LOG_TO_STDOUT=true

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Use the deploy script
CMD ["bash", "railway-deploy.sh"]

