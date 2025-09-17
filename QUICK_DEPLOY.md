# 🚀 Quick Railway Deployment for floridasbackroom.com

## After GitHub Login, Follow These Steps:

### 1. Create New Project
- Click **"New Project"** button
- Select **"Deploy from GitHub repo"**
- Search for: **ai-development-monorepo**
- Click on **birddigital/ai-development-monorepo**

### 2. Configure Settings
When the configuration modal appears:
- **Root Directory**: Enter exactly: `projects/active-projects/medusa-railway-deploy`
- Click **"Deploy"**

### 3. Add PostgreSQL (REQUIRED)
After deployment starts:
- Click **"+ New"** button
- Select **"Database"**
- Choose **"PostgreSQL"**
- Wait for it to provision (green checkmark)

### 4. Add Redis (REQUIRED)
- Click **"+ New"** again
- Select **"Database"**
- Choose **"Redis"**
- Wait for it to provision (green checkmark)

### 5. Set Environment Variables
- Click on your **medusa-railway-deploy** service
- Go to **"Variables"** tab
- Add these REQUIRED variables:

```
JWT_SECRET=sk_fdjkla893jkldfa89043jklfdajkl890432jklfda
COOKIE_SECRET=cs_89043jklfda890jklfdsa7890fdajkl4321fdajkl
NODE_ENV=production
STORE_CORS=https://floridasbackroom.com
```

### 6. Configure Custom Domain
- Go to **"Settings"** tab
- Scroll to **"Networking"**
- Under **"Public Networking"**, click **"Generate Domain"** first (for testing)
- Test the generated domain works
- Then click **"+ Add Custom Domain"**
- Enter: `floridasbackroom.com`
- Add the CNAME to your DNS:
  ```
  Type: CNAME
  Name: @ (or use 'www' if @ doesn't work)
  Value: [the-value-railway-shows].up.railway.app
  TTL: 3600 (or Auto)
  ```

### 7. Wait for Deployment
- Check **"Deployments"** tab
- Should show green "Success" in 3-5 minutes
- If it fails, check the logs

### 8. Verify It's Working
Test these URLs in order:
1. Railway domain: `https://[your-app].up.railway.app/health`
2. Your domain: `https://floridasbackroom.com/health`

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected"
}
```

### 9. Create Admin User
Once deployed, in Railway:
- Go to your service
- Click **"Settings"** → **"Run Command"**
- Enter: `medusa user -e admin@floridasbackroom.com -p your-secure-password`
- Click **"Run"**

### 10. Access Admin Panel
- Admin: `https://floridasbackroom.com/admin`
- API: `https://floridasbackroom.com/store`

## 🚨 Common Issues

**Build fails?**
- Check logs for missing environment variables
- Ensure PostgreSQL and Redis are connected

**Domain not working?**
- DNS can take 5-30 minutes to propagate
- Use Railway's domain first to test

**Database connection error?**
- Make sure PostgreSQL shows green checkmark
- Check DATABASE_URL is in variables (auto-added)

---

Tell me when you're logged in and I can help automate the rest!