# Deployment Guide to Render

Complete guide to deploy both backend and frontend of IsaStore to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com) (free tier available)
2. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket
3. **Master Key**: Locate your `config/master.key` file (you'll need it for the backend)

## Part 1: Deploy Backend (Rails API)

### Option A: Using Blueprint (Recommended - Easiest)

1. **Push code to Git**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create Blueprint in Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **New +** → **Blueprint**
   - Connect your Git repository
   - Select the repository and branch (usually `main` or `master`)

3. **Configure Blueprint**:
   - Render will automatically detect `render.yaml` in `isa_store_backend`
   - If prompted, select `isa_store_backend` directory as the root
   - Click **Apply**

4. **Set Master Key**:
   - Once the services are created, go to the **isa-store-backend** web service
   - Navigate to **Environment** tab
   - Find `RAILS_MASTER_KEY` and click **Sync**
   - Copy the value from your local `isa_store_backend/config/master.key` file
   - Paste it and mark it as **Secret**
   - Click **Save Changes**

5. **Wait for Deployment**:
   - Render will automatically build and deploy
   - Check the **Logs** tab to monitor progress
   - Note your backend URL (e.g., `https://isa-store-backend.onrender.com`)

### Option B: Manual Setup

#### Step 1: Create PostgreSQL Database

1. In Render dashboard, click **New +** → **PostgreSQL**
2. Configure:
   - **Name**: `isa-store-db`
   - **Database**: `isa_store_production`
   - **User**: `isa_store_user`
   - **Plan**: Starter (free tier available)
3. Click **Create Database**
4. Wait for the database to be created (takes ~2-3 minutes)
5. Note the **Internal Database URL** (you'll need this)

#### Step 2: Create Web Service

1. In Render dashboard, click **New +** → **Web Service**
2. Connect your Git repository
3. Configure:
   - **Name**: `isa-store-backend`
   - **Root Directory**: `isa_store_backend`
   - **Environment**: `Ruby`
   - **Build Command**: `./bin/render-build.sh`
   - **Start Command**: `bundle exec puma -C config/puma.rb`
   - **Plan**: Starter (free tier)

#### Step 3: Configure Environment Variables

In the web service **Environment** tab, add:

| Key | Value | Secret |
|-----|-------|--------|
| `RAILS_ENV` | `production` | No |
| `RAILS_MASTER_KEY` | (from `config/master.key`) | **Yes** |
| `RAILS_SERVE_STATIC_FILES` | `true` | No |
| `RAILS_LOG_TO_STDOUT` | `true` | No |
| `DATABASE_URL` | (from database connection string) | **Yes** |

#### Step 4: Link Database

1. In your web service settings
2. Go to **Environment** tab
3. Scroll to **Database** section
4. Click **Link Database**
5. Select `isa-store-db`
6. Render will automatically add `DATABASE_URL`

#### Step 5: Deploy

1. Click **Manual Deploy** → **Deploy latest commit**
2. Monitor the build logs
3. Wait for "Your service is live" message
4. Save your backend URL: `https://isa-store-backend.onrender.com`

### Verify Backend Deployment

Test your API:
```bash
curl https://isa-store-backend.onrender.com/api/products
```

You should get a JSON response with your products.

## Part 2: Deploy Frontend (React)

The frontend needs to be configured to point to your Render backend URL.

### Step 1: Create Environment Configuration

Create a file to configure the API URL for production:

1. **Update `vite.config.js`** to use environment variables:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 3000,
       proxy: {
         '/api': {
           target: process.env.VITE_API_URL || 'http://localhost:3001',
           changeOrigin: true
         }
       }
     },
     define: {
       'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '')
     }
   })
   ```

2. **Create API utility** or update fetch calls to use environment variable

### Step 2: Deploy Frontend to Render

1. **Create Static Site in Render**:
   - In Render dashboard, click **New +** → **Static Site**
   - Connect your Git repository
   - Configure:
     - **Name**: `isa-store-frontend`
     - **Root Directory**: `isa_store_frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
     - **Environment Variables**:
       - `VITE_API_URL`: `https://isa-store-backend.onrender.com`

2. **Deploy**:
   - Render will build and deploy automatically
   - Note your frontend URL: `https://isa-store-frontend.onrender.com`

### Alternative: Deploy Frontend to Vercel/Netlify

You can also deploy the frontend to Vercel or Netlify:

#### Vercel:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory to `isa_store_frontend`
5. Add environment variable:
   - `VITE_API_URL`: `https://isa-store-backend.onrender.com`
6. Deploy

#### Netlify:

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Add new site from Git
4. Set:
   - **Base directory**: `isa_store_frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
5. Add environment variable:
   - `VITE_API_URL`: `https://isa-store-backend.onrender.com`
6. Deploy

## Part 3: Update Frontend to Use API URL

Before deploying the frontend, you need to update it to use the production API URL. We'll create a configuration file:

1. Create `isa_store_frontend/src/config.js`:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || ''
   export const getApiUrl = () => API_URL || ''
   ```

2. Update all fetch calls to use the API URL:
   ```javascript
   import { getApiUrl } from '../config.js'
   
   fetch(`${getApiUrl()}/api/products`)
   ```

However, since this requires updating multiple files, a simpler approach is to update `vite.config.js` to handle both development and production properly.

## Summary Checklist

- [ ] Code pushed to Git repository
- [ ] Backend deployed on Render (PostgreSQL + Web Service)
- [ ] `RAILS_MASTER_KEY` configured in backend environment
- [ ] Backend URL tested and working
- [ ] Frontend API URL configured
- [ ] Frontend deployed (Render/Vercel/Netlify)
- [ ] Both sites tested end-to-end

## Post-Deployment

### Seed Database (if needed)

You may want to seed your production database with initial data:

1. Use Render Shell (found in your web service dashboard)
2. Run:
   ```bash
   bundle exec rails db:seed
   ```

### Monitor Logs

- Check Render dashboard logs regularly
- Set up alerts for errors
- Monitor database usage (free tier has limits)

## Troubleshooting

### Backend Issues

- **Build fails**: Check `RAILS_MASTER_KEY` is set correctly
- **Database connection errors**: Verify `DATABASE_URL` is linked
- **502 errors**: Check if service is sleeping (free tier), wait for wake-up
- **Migrations fail**: Check build logs, may need to fix migration

### Frontend Issues

- **API calls fail**: Verify `VITE_API_URL` is set correctly
- **CORS errors**: Backend CORS config should allow all origins (already configured)
- **Build fails**: Check Node.js version compatibility

### Database Issues

- **Free tier limits**: PostgreSQL free tier has 90MB storage and 90-day limit
- **Connection limits**: Monitor active connections

## Notes

- **Free Tier Limitations**:
  - Services sleep after 15 minutes of inactivity
  - First request after sleep may take 30-60 seconds (cold start)
  - PostgreSQL free tier: 90MB storage, 90 days
  
- **Upgrading**:
  - Consider paid plans for production use
  - Paid plans don't sleep and have better performance
  - Larger database storage available

- **Custom Domain**:
  - Both Render services can use custom domains
  - Configure in service settings → **Custom Domains**

## Support

For Render-specific issues, check:
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)

