# 🚀 MedusaJS 2.0 Deployment Instructions

## Easiest Method: One-Click Railway Deploy

### Option 1: Use Railway Template (Recommended)
1. **Click this button:** [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/gkU-27)
2. **Connect GitHub** when prompted
3. **Wait** for automatic deployment (~5 minutes)
4. **Done!** Your MedusaJS store is live

### Option 2: Deploy from This Repository

1. **Go to Railway.app**
   - Visit: https://railway.app
   - Sign up/login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `birddigital/ai-development-monorepo`
   - Set root directory: `projects/active-projects/medusa-railway-deploy`

3. **Add Required Services**
   - Click "+ New" → "Database" → "Add PostgreSQL"
   - Click "+ New" → "Database" → "Add Redis"

4. **Set Environment Variables**
   Railway auto-provides:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `PORT`
   
   You must add (click "Variables" tab):
   ```
   JWT_SECRET=<click-generate-to-create-random-string>
   COOKIE_SECRET=<click-generate-to-create-random-string>
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy" button
   - Wait for build to complete (~3-5 minutes)

## 🎯 Post-Deployment Setup

### 1. Create Admin User
After deployment completes:
```bash
# Using Railway CLI
railway exec medusa user -e admin@youremail.com -p yourpassword

# Or from Railway dashboard
# Go to your service → Settings → Run Command
# Enter: medusa user -e admin@youremail.com -p yourpassword
```

### 2. Access Your Store
- **Admin Dashboard:** `https://your-app.railway.app/admin`
- **Store API:** `https://your-app.railway.app/store`
- **Health Check:** `https://your-app.railway.app/health`

## 🔧 Alternative: Deploy with Railway CLI

If you prefer command line:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Clone and navigate
git clone https://github.com/birddigital/ai-development-monorepo.git
cd ai-development-monorepo/projects/active-projects/medusa-railway-deploy

# Deploy
railway login
railway init
railway up

# Add databases
railway add postgresql
railway add redis

# Set variables
railway vars set JWT_SECRET=$(openssl rand -base64 32)
railway vars set COOKIE_SECRET=$(openssl rand -base64 32)

# Open your app
railway open
```

## ✅ Verify Deployment

1. **Check Health Endpoint**
   ```bash
   curl https://your-app.railway.app/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "redis": "connected"
   }
   ```

2. **Access Admin Panel**
   - Go to: `https://your-app.railway.app/admin`
   - Login with credentials created earlier

## 🎉 Success!

Your MedusaJS 2.0 e-commerce platform is now live on Railway with:
- ✅ Auto-scaling infrastructure
- ✅ Managed PostgreSQL database
- ✅ Redis caching
- ✅ SSL certificates
- ✅ Custom domains support
- ✅ Zero-downtime deployments

## 🆘 Troubleshooting

**Build fails?**
- Check logs in Railway dashboard
- Ensure Node.js version is 20+

**Can't access admin?**
- Did you create an admin user?
- Check CORS settings in environment variables

**Database connection error?**
- PostgreSQL service should auto-connect
- Check DATABASE_URL is set in variables

## 📞 Support

- [MedusaJS Discord](https://discord.gg/medusajs)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/birddigital/ai-development-monorepo/issues)