# Deployment Guide

## Backend — Railway

### Prerequisites
- Railway account at [railway.app](https://railway.app)
- `RAILS_MASTER_KEY` from `isa_store_backend/config/master.key`

### Steps

1. **New project** → Deploy from GitHub repo → select your repository
2. **Add PostgreSQL** → New → Database → PostgreSQL (Railway auto-sets `DATABASE_URL`)
3. **Add Volume** (required for persistent image storage):
   - Service → Volumes → New Volume
   - Mount path: `/data`, size: 1GB
   - Without this, uploaded images are deleted on every redeploy
4. **Set environment variables** in the backend service:
   ```
   RAILS_MASTER_KEY=<contents of config/master.key>
   ADMIN_EMAIL=admin@isastore.com
   ADMIN_PASSWORD=<your-secure-password>
   ADMIN_NAME=Admin
   ```
5. **Root directory** → Settings → set to `isa_store_backend`
6. **Deploy** — Railway runs `bundle install`, migrations, and starts Puma automatically
7. **Generate domain** → Settings → Networking → Generate Domain
8. **Seed database** (first time):
   ```bash
   brew install railway
   railway login
   cd isa_store_backend && railway link
   railway run rails db:seed
   ```

### Useful Railway CLI commands
```bash
railway logs                  # view logs
railway run rails console     # Rails console
railway run rails db:migrate  # run migrations
railway shell                 # SSH into container
```

---

## Frontend — Vercel

### Prerequisites
- Vercel account at [vercel.com](https://vercel.com)
- Your Railway backend URL

### Steps

1. **Import project** → Add New → Project → import your GitHub repo
2. **Root directory** → set to `isa_store_frontend`
3. **Framework**: Vite (auto-detected)
4. **Environment variable**:
   ```
   VITE_API_URL=https://your-app.up.railway.app
   ```
   No trailing slash. No `/api` at the end.
5. **Deploy**

### After deploying — update CORS

In `isa_store_backend/config/initializers/cors.rb`, add your Vercel domain:

```ruby
origins 'http://localhost:3000', 'https://your-frontend.vercel.app'
```

Commit and push to trigger a Railway redeploy.

---

## Reviews — OAuth Setup

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Authorized origins: `http://localhost:5173`, `https://your-app.vercel.app`
4. Add to Vercel environment variables:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

### Facebook OAuth

1. [Facebook Developers](https://developers.facebook.com/) → New App → Add Facebook Login
2. Authorized redirect URIs: `http://localhost:5173`, `https://your-app.vercel.app`
3. Add to Vercel:
   ```
   VITE_FACEBOOK_APP_ID=your-app-id
   ```
4. Add to Railway:
   ```
   FACEBOOK_APP_ID=your-app-id
   FACEBOOK_APP_SECRET=your-app-secret
   ```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| No products load on frontend | Check `VITE_API_URL` in Vercel; check CORS on backend |
| CORS errors in browser | Add Vercel domain to `cors.rb`, push to trigger redeploy |
| Images disappear after deploy | Create Railway Volume mounted at `/data` |
| Missing master key error | Add `RAILS_MASTER_KEY` to Railway env vars |
| Build fails | Check Vercel/Railway logs; test `npm run build` locally first |
