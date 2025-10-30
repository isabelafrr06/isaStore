# Vercel Frontend Deployment Guide

Complete guide to deploy IsaStore frontend to Vercel.

## Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- Your Railway backend URL (from Railway dashboard)
- GitHub repository with your code pushed

## Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub repositories

## Step 2: Import Your Project

1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Click **"Import"** next to your `isaStore` repository
4. If you don't see it, click **"Adjust GitHub App Permissions"** and grant access

## Step 3: Configure Project Settings

Vercel will show a configuration screen:

### Root Directory
Since this is a monorepo, set the root directory:
- Click **"Edit"** next to Root Directory
- Set it to: `isa_store_frontend`
- Click **"Continue"**

### Framework Preset
- Vercel should auto-detect **"Vite"**
- If not, select **"Vite"** from the dropdown

### Build Settings
These should be auto-detected, but verify:
- **Build Command**: `npm run build` or `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Step 4: Add Environment Variables

This is the MOST IMPORTANT step! Click **"Environment Variables"** and add:

### Required Variable:

**Variable Name:**
```
VITE_API_URL
```

**Value:**
```
https://your-railway-app.up.railway.app
```

**IMPORTANT:** 
- Get your Railway backend URL from Railway dashboard (Settings -> Networking)
- Do NOT include a trailing slash
- Do NOT include `/api` at the end
- Example: `https://isastore-backend-production.up.railway.app`

### How to Get Your Railway URL:
1. Go to your Railway project
2. Click on your backend service
3. Go to **"Settings"**
4. Scroll to **"Networking"** section
5. Copy the domain (it looks like `your-app.up.railway.app`)
6. Add `https://` in front of it

## Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build your React app (`npm run build`)
   - Deploy to their CDN

3. Watch the build logs in real-time
4. Deployment usually takes 1-3 minutes

## Step 6: Get Your Frontend URL

1. Once deployed, Vercel gives you a URL like:
   - `https://isa-store.vercel.app` (your production URL)
   - `https://isa-store-git-main-username.vercel.app` (branch-specific)

2. Click on the URL to test your frontend!

## Step 7: Update CORS on Backend

Now you need to allow your Vercel frontend to access your Railway backend:

1. Open `isa_store_backend/config/initializers/cors.rb`
2. Update the origins to include your Vercel domain:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000', 
            'https://your-frontend.vercel.app'  # Add your Vercel URL here
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

3. Commit and push:
```bash
git add isa_store_backend/config/initializers/cors.rb
git commit -m "Update CORS to allow Vercel frontend"
git push
```

4. Railway will automatically redeploy with the new CORS settings

## Step 8: Test Your Live App

Visit your Vercel URL and test:
1. Can you see products? (tests GET /api/products)
2. Can you add items to cart? (tests POST /api/cart/add)
3. Can you view the cart? (tests GET /api/cart)
4. Can you complete an order via WhatsApp? (tests POST /api/orders)
5. Can admin login? (tests POST /api/admin/login)

## Troubleshooting

### Frontend Shows But No Products Load

**Problem:** CORS error or wrong API URL

**Solution:**
1. Check browser console (F12) for errors
2. Verify `VITE_API_URL` is set correctly in Vercel
3. Make sure CORS is updated on backend
4. Check Railway backend is running (visit `https://your-backend.up.railway.app/api/products`)

### Environment Variable Not Working

**Problem:** Built with wrong/missing `VITE_API_URL`

**Solution:**
1. Go to Vercel project settings
2. Click **"Environment Variables"**
3. Verify `VITE_API_URL` is set
4. Click **"Deployments"** tab
5. Click **"..."** on latest deployment
6. Click **"Redeploy"**

### CORS Errors in Browser Console

**Problem:** Backend not allowing frontend domain

**Solution:**
1. Check `isa_store_backend/config/initializers/cors.rb`
2. Add your Vercel domain to `origins`
3. Commit and push to trigger Railway redeploy
4. Wait for Railway to redeploy (check Railway logs)

### Images Not Loading

**Problem:** Image URLs pointing to wrong backend

**Solution:**
1. Verify your `config.js` has correct `getImageUrl()` function
2. Check `VITE_API_URL` is set in Vercel
3. Redeploy if needed

### Build Fails

**Problem:** Dependencies or build errors

**Solution:**
1. Check the build logs in Vercel
2. Make sure `package.json` has all dependencies
3. Try building locally first: `cd isa_store_frontend && npm run build`
4. Check Node.js version compatibility

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches or pull requests

You'll get a unique URL for each deployment to test before merging!

## Custom Domain (Optional)

To use your own domain:

1. Go to your project in Vercel
2. Click **"Settings"** -> **"Domains"**
3. Click **"Add"**
4. Enter your domain name
5. Follow Vercel's instructions to update your DNS records

## Useful Vercel CLI Commands

Install Vercel CLI:
```bash
npm install -g vercel
```

Commands:
```bash
# Deploy from command line
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Link local project to Vercel
vercel link

# Pull environment variables
vercel env pull
```

## Cost

Vercel offers:
- **Hobby Plan**: FREE for personal projects
  - Unlimited deployments
  - Automatic HTTPS
  - Global CDN
  - Preview deployments
- **Pro Plan**: $20/month for commercial use

## Summary Checklist

- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `isa_store_frontend`
- [ ] Add `VITE_API_URL` environment variable with Railway backend URL
- [ ] Deploy
- [ ] Get Vercel frontend URL
- [ ] Update CORS in backend to allow Vercel domain
- [ ] Test the live application
- [ ] Celebrate - your store is live!

## Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.up.railway.app`
- **Admin Panel**: `https://your-app.vercel.app/admin/login`
- **Store**: `https://your-app.vercel.app`

## Next Steps After Deployment

1. Test all functionality on the live site
2. Add your Railway backend domain to CORS
3. Seed your production database (if not done already)
4. Set strong admin password via Railway environment variables
5. Share your store URL with customers!

## Support

If you run into issues:
- Check Vercel build logs
- Check Railway deployment logs
- Check browser console for errors
- Verify all environment variables are set correctly

