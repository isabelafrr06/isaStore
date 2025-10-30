# Render Deployment Guide

This guide will help you deploy IsaStore backend to Render.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Create a PostgreSQL Database

1. Go to your Render dashboard
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `isa-store-db`
   - **Database**: `isa_store_production`
   - **User**: `isa_store_user`
   - **Plan**: Starter (or higher)
4. Click **Create Database**
5. Save the connection details (Render will provide `DATABASE_URL`)

### 2. Deploy the Web Service

1. In Render dashboard, click **New +** → **Web Service**
2. Connect your repository
3. Configure:
   - **Name**: `isa-store-backend`
   - **Environment**: `Ruby`
   - **Build Command**: `./bin/render-build.sh`
   - **Start Command**: `bundle exec puma -C config/puma.rb`
   - **Plan**: Starter (or higher)

### 3. Configure Environment Variables

In your Render web service, add these environment variables:

- **RAILS_ENV**: `production`
- **RAILS_MASTER_KEY**: (Get from `config/master.key` file - mark as secret)
- **RAILS_SERVE_STATIC_FILES**: `true`
- **RAILS_LOG_TO_STDOUT**: `true`
- **DATABASE_URL**: (Automatically set if you linked the PostgreSQL database)

### 4. Link Database to Web Service

1. In your web service settings
2. Go to **Environment** tab
3. Find **Add Database** and select your PostgreSQL database
4. Render will automatically add `DATABASE_URL`

### 5. Deploy

1. Render will automatically build and deploy
2. Check the logs to ensure migrations ran successfully
3. Access your API at the provided URL

## Manual Database Setup (if needed)

If you need to run migrations manually:

```bash
# SSH into your Render instance or use Render shell
bundle exec rails db:migrate
bundle exec rails db:seed
```

## Frontend Configuration

Update your frontend API URL to point to your Render backend:

```javascript
// In vite.config.js or wherever you configure API URLs
const API_URL = 'https://isa-store-backend.onrender.com'
```

## Troubleshooting

- **Database connection errors**: Make sure the database is linked to your web service
- **Build failures**: Check that `RAILS_MASTER_KEY` is set correctly
- **Asset compilation errors**: Ensure `RAILS_SERVE_STATIC_FILES=true` is set
- **Port errors**: Render sets `PORT` automatically, Puma will use it

## Notes

- Render provides a free tier for PostgreSQL (limited to 90 days or 90MB)
- The starter plan includes 512MB RAM
- Your app will sleep after 15 minutes of inactivity on the free tier
- Consider upgrading to paid plans for production use







