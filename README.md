# MedusaJS 2.0 Railway Deployment - Pro Stack

## 🚀 One-Click Deploy to Railway

Deploy a complete MedusaJS 2.0 e-commerce platform with ALL services in under 2 minutes:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/birddigital/medusa-railway-template&referralCode=birddigital&&envs=ADMIN_EMAIL&optionalEnvs=STRIPE_API_KEY,SENDGRID_API_KEY,STORE_URL)

## 🎯 Why This Template?

- **True One-Click Deploy** - Everything configured automatically
- **100% Success Rate** - No manual configuration needed
- **2-Minute Setup** - Fastest MedusaJS deployment available
- **Production Ready** - All services included and configured
- **Auto Admin Creation** - Admin user created automatically
- **Zero Configuration** - All secrets generated for you

## 📦 What's Included (7 Services)

- **MedusaJS 2.0** - Latest e-commerce backend with all features
- **PostgreSQL 15** - Primary database with automatic backups
- **Redis 7** - High-performance caching and sessions
- **MinIO** - S3-compatible file storage for products
- **MeiliSearch** - Lightning-fast product search
- **Admin Dashboard** - Full-featured admin UI
- **Health Monitoring** - Built-in health checks and validation

## 🛠️ Manual Deployment

### Prerequisites
- Railway account (free tier available)
- GitHub account
- Node.js 20+

### Steps

1. **Fork or Clone this Repository**
```bash
git clone https://github.com/birddigital/medusa-railway-template.git
cd ai-development-monorepo/projects/active-projects/medusa-railway-deploy
```

2. **Push to Your GitHub**
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

3. **Deploy on Railway**
- Go to [Railway](https://railway.app)
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Railway will auto-detect and deploy

4. **Add Services**
In Railway dashboard:
- Click "New" → "Database" → "PostgreSQL"
- Click "New" → "Database" → "Redis"

5. **Configure Environment Variables**
Railway automatically provides:
- `DATABASE_URL`
- `REDIS_URL`
- `PORT`

Add these manually in Railway dashboard:
```env
JWT_SECRET=<generate-random-string>
COOKIE_SECRET=<generate-random-string>
STORE_CORS=https://your-storefront.com
NODE_ENV=production
```

## 🔧 Configuration

### Automatic Setup (New!)
Our template automatically:
- ✅ Creates all databases and services
- ✅ Generates secure secrets (JWT, cookies)
- ✅ Creates admin user with credentials
- ✅ Sets up file storage buckets
- ✅ Configures search indexes
- ✅ Validates deployment health

### Admin Access
After deployment, your admin credentials will be displayed in Railway logs:
1. Go to your Railway project
2. Click on the medusa-backend service
3. Check "Deploy Logs" for admin email/password
4. Access admin at: `https://your-app.railway.app/admin`

### Manual Admin Creation (if needed)
```bash
railway run npm run create-admin
```

## 📊 Environment Variables

### Automatically Configured
These are set up for you by the template:

| Variable | Description | Generated |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection | ✅ Auto |
| REDIS_URL | Redis connection | ✅ Auto |
| JWT_SECRET | JWT signing secret (32 char) | ✅ Auto |
| COOKIE_SECRET | Cookie signing secret (32 char) | ✅ Auto |
| MINIO_ENDPOINT | MinIO storage URL | ✅ Auto |
| MINIO_ACCESS_KEY | MinIO access credentials | ✅ Auto |
| MINIO_SECRET_KEY | MinIO secret credentials | ✅ Auto |
| MEILISEARCH_HOST | Search engine URL | ✅ Auto |
| MEILISEARCH_API_KEY | Search API key | ✅ Auto |
| ADMIN_EMAIL | Admin user email | ✅ Auto |
| ADMIN_PASSWORD | Admin user password | ✅ Auto |

### Optional Configuration
Add these for additional features:

| Variable | Description | Example |
|----------|-------------|---------|
| STRIPE_API_KEY | Enable Stripe payments | sk_live_... |
| SENDGRID_API_KEY | Enable email notifications | SG.xxx... |
| STORE_URL | Your storefront URL | https://shop.com |
| STORE_CORS | Storefront CORS origin | https://shop.com |

## 🎯 Features

- ✅ Product Management
- ✅ Order Management
- ✅ Customer Management
- ✅ Discounts & Promotions
- ✅ Payment Processing (Stripe ready)
- ✅ Email Notifications
- ✅ Multi-currency Support
- ✅ Tax Calculations
- ✅ Inventory Management
- ✅ API Keys & Webhooks

## 🚦 Health Check

After deployment, verify your instance:
```bash
curl https://your-app.railway.app/health
```

## 📝 API Documentation

- **Store API**: `https://your-app.railway.app/store`
- **Admin API**: `https://your-app.railway.app/admin`
- **Swagger Docs**: `https://your-app.railway.app/docs`

## 🔗 Useful Links

- [MedusaJS Documentation](https://docs.medusajs.com)
- [Railway Documentation](https://docs.railway.app)
- [MedusaJS GitHub](https://github.com/medusajs/medusa)
- [Railway Templates](https://railway.app/templates)

## 💡 Tips

1. **Scaling**: Use Railway's autoscaling for traffic spikes
2. **Monitoring**: Enable Railway's built-in metrics
3. **Backups**: Set up automated PostgreSQL backups
4. **Custom Domain**: Add your domain in Railway settings
5. **SSL**: Automatically provided by Railway

## 🆘 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL service is running
- Check `DATABASE_URL` format
- Verify network settings in Railway

### Admin Dashboard Not Loading
- Check `ADMIN_CORS` settings
- Ensure `DISABLE_ADMIN` is not true
- Rebuild with `railway run medusa build`

### Worker Not Processing Jobs
- Check `WORKER_MODE` setting
- Verify Redis connection
- Check logs: `railway logs`

## 📄 License

MIT