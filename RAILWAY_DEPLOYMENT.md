# Railway Deployment Guide

Complete guide to deploy IsaStore backend to Railway.

## Prerequisites

- GitHub account with your code pushed to a repository
- Railway account (sign up at [railway.app](https://railway.app))
- Your `RAILS_MASTER_KEY` (located at `isa_store_backend/config/master.key`)

## Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** or **"Login with GitHub"**
3. Authorize Railway to access your GitHub repositories

## Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `isabelafrr06/isaStore`
4. Railway will automatically detect it's a Rails application

## Step 3: Add PostgreSQL Database

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will automatically:
   - Create a PostgreSQL database
   - Generate a `DATABASE_URL` environment variable
   - Link it to your backend service

## Step 4: Create Volume for Image Storage (Critical!)

**⚠️ Important:** Railway uses ephemeral filesystems. Images uploaded through the admin panel will be **deleted on every deployment** unless you use a Railway Volume.

### Why You Need a Volume

Without a volume:
- Images are stored in `/app/public/images/`
- All images are deleted when Railway redeploys your service
- You'll lose all product images after each deployment

With a volume:
- Images are stored in `/data/images/` (persistent storage)
- Images persist across deployments
- Your product images remain safe

### How to Create the Volume

1. In your Railway project dashboard, click on your **backend service**
2. Go to the **"Volumes"** tab
3. Click **"+ New Volume"**
4. Configure the volume:
   - **Name:** `images-storage` (or any name you prefer)
   - **Mount Path:** `/data`
   - **Size:** Start with 1GB (you can increase later if needed)
5. Click **"Add Volume"**

### Set Environment Variable

After creating the volume, Railway will automatically set the `RAILWAY_VOLUME_MOUNT_PATH` environment variable to `/data`. The backend code will automatically detect this and use the volume for image storage.

**That's it!** Images will now persist across deployments. ✅

### Verify Volume Setup

After deployment, you can verify the volume is working:
1. Upload a product image through the admin panel
2. Check the deployment logs to confirm images are being saved to `/data/images/`
3. Redeploy your service - your images should still be accessible

## Step 5: Configure Environment Variables

1. Click on your **backend service** (not the database)
2. Go to the **"Variables"** tab
3. Click **"+ New Variable"** and add the following:

### Required Variables:

```bash
RAILS_MASTER_KEY=<your-master-key-here>
```

**To get your RAILS_MASTER_KEY:**
```bash
cat isa_store_backend/config/master.key
```

Copy the entire key and paste it as the value.

### Optional Variables (Railway sets these automatically, but you can override):

```bash
RAILS_ENV=production
RAILS_SERVE_STATIC_FILES=true
RAILS_LOG_TO_STDOUT=true
```

## Step 6: Configure Root Directory

Since this is a monorepo (frontend + backend), you need to tell Railway where the backend code is:

1. In your backend service, go to **"Settings"**
2. Find **"Root Directory"**
3. Set it to: `isa_store_backend`
4. Click **"Save"**

## Step 7: Deploy

1. Railway will automatically start deploying
2. You can watch the build logs in real-time
3. The deployment process will:
   - Install Ruby and dependencies (`bundle install`)
   - Run database migrations (`rails db:migrate`)
   - Start the Puma server

## Step 8: Get Your Backend URL

1. Once deployed, go to **"Settings"**
2. Scroll down to **"Networking"**
3. Click **"Generate Domain"**
4. Railway will give you a URL like: `https://your-app-name.up.railway.app`
5. **Copy this URL** - you'll need it for the frontend!

## Step 9: Seed Your Database (First Time Only)

You need to seed the database with products and admin user:

1. In your Railway project, click on your backend service
2. Go to the **"Settings"** tab
3. Scroll down and find **"One-off Commands"** or use the **Railway CLI**

### Option A: Using Railway Dashboard
If available, run:
```bash
bundle exec rails db:seed
```

### Option B: Using Railway CLI (Recommended)

1. Install Railway CLI:
```bash
brew install railway
```

2. Login to Railway:
```bash
railway login
```

3. Link your project:
```bash
cd isa_store_backend
railway link
```

4. Run the seed command:
```bash
railway run rails db:seed
```

## Step 10: Set Admin Password (Important!)

For security, set your admin password using environment variables:

1. Go back to **"Variables"** in your Railway backend service
2. Add these variables:
```bash
ADMIN_EMAIL=admin@isastore.com
ADMIN_PASSWORD=<your-secure-password>
ADMIN_NAME=Admin
```

3. Redeploy or re-run the seed command

## Step 11: Test Your Backend

Test your deployed backend:

1. Visit: `https://your-app-name.up.railway.app/api/products`
2. You should see a JSON array of products
3. Try the admin login at: `https://your-app-name.up.railway.app/api/admin/login`

## Step 12: Configure Frontend

Now update your frontend to use the Railway backend:

1. Create a `.env.production` file in `isa_store_frontend/`:
```bash
VITE_API_URL=https://your-app-name.up.railway.app
```

2. When deploying the frontend (Vercel, Netlify, etc.), set this environment variable:
```
VITE_API_URL=https://your-app-name.up.railway.app
```

## Troubleshooting

### Build Fails with Asset Errors
Already fixed! We disabled the asset pipeline in `production.rb`

### Database Connection Error
- Check that PostgreSQL is added and linked to your service
- Verify `DATABASE_URL` is in your environment variables

### Missing Master Key Error
- Make sure you added `RAILS_MASTER_KEY` to environment variables
- Get the key from: `cat isa_store_backend/config/master.key`

### Can't Access API Endpoints
- Make sure your domain is generated (Settings → Networking)
- Check CORS settings in `cors.rb` allow your frontend domain

### Migrations Don't Run
- Check the build logs to see if the `release:` command ran
- Manually run: `railway run rails db:migrate`

### Images Disappear After Deployment
- **You must create a Railway Volume** (see Step 4)
- Without a volume, images are stored in ephemeral storage and deleted on each deployment
- Verify the volume is mounted at `/data` in your service settings
- Check that `RAILWAY_VOLUME_MOUNT_PATH` environment variable is set to `/data`
- Verify images are being saved to `/data/images/` by checking deployment logs

### Images Not Loading (404 Errors)
- Check that the volume is properly mounted and accessible
- Verify the Rack::Static middleware is configured (see `config/initializers/railway_volume.rb`)
- Check Railway logs for image serving errors
- Ensure `config.public_file_server.enabled = true` in `production.rb`

## Useful Railway CLI Commands

```bash
# View logs
railway logs

# Run Rails console
railway run rails console

# Run migrations
railway run rails db:migrate

# Seed database
railway run rails db:seed

# SSH into the container
railway shell
```

## Cost

Railway offers:
- **Free Tier**: $5 worth of usage per month (enough for development/testing)
- **Hobby Plan**: $5/month + usage
- PostgreSQL database included

## Next Steps

1. Backend deployed on Railway
2. Update frontend `config.js` with your Railway URL
3. Deploy frontend to Vercel/Netlify
4. Update CORS to allow your frontend domain
5. Your store is live!

## CORS Configuration

Once you deploy your frontend, update `isa_store_backend/config/initializers/cors.rb`:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://your-frontend-domain.vercel.app' # Add your frontend domain
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

Then commit and push to trigger a redeploy on Railway.

