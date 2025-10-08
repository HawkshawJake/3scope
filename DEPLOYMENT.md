# 🚀 Deployment Guide

This guide covers deploying the 3Scope application with separate frontend and backend hosting.

## 📋 Deployment Architecture

```
Frontend (Vercel)  →  Backend (Railway)  →  MongoDB Atlas
    Port 80/443        Port 3001              Port 27017
```

## 🔧 Prerequisites

- GitHub account with this repository
- Vercel account (free tier available)
- Railway account (free tier available)
- MongoDB Atlas account (free tier available)

## 🌐 Frontend Deployment (Vercel)

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the root directory (not backend/)

### 2. Configure Build Settings
```bash
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3. Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:
```env
VITE_API_URL=https://your-backend-url.up.railway.app
```

### 4. Deploy
- Vercel will auto-deploy on every push to main branch
- Custom domain can be configured in Vercel settings

## 🖥️ Backend Deployment (Railway)

### 1. Connect Repository
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose "Deploy from a folder" → Select `backend/`

### 2. Configure Settings
Railway will automatically:
- Detect Node.js project
- Install dependencies with `npm install`
- Use `railway.toml` configuration

### 3. Environment Variables
Add these in Railway Dashboard → Variables:
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/3scope
JWT_SECRET=your-super-secure-production-jwt-secret-here
CLIMATIQ_API_KEY=your-climatiq-api-key
BCRYPT_SALT_ROUNDS=12
```

### 4. Custom Domain (Optional)
- Railway provides a default domain: `your-app.up.railway.app`
- Custom domains available in Railway settings

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create Cluster
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account and new project
3. Create M0 Sandbox cluster (free tier)

### 2. Configure Access
1. **Database Access**: Create user with read/write permissions
2. **Network Access**: Add `0.0.0.0/0` for Railway access (or specific Railway IPs)

### 3. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database user password

## 🔄 Auto-Deployment Workflow

```bash
git add .
git commit -m "Your changes"
git push origin main
  ↓
GitHub triggers webhooks
  ↓
Vercel rebuilds frontend
Railway rebuilds backend
  ↓
Live updates deployed
```

## 🧪 Testing Deployment

### 1. Health Checks
```bash
# Test backend health
curl https://your-backend.up.railway.app/health

# Test frontend
curl https://your-frontend.vercel.app
```

### 2. API Integration Test
```bash
# Test API through frontend proxy
curl https://your-frontend.vercel.app/api/health
```

## 🔒 Security Checklist

### Environment Variables
- ✅ No secrets in code
- ✅ Different JWT secrets for dev/prod
- ✅ MongoDB connection secured
- ✅ Climatiq API key secured

### Database Security
- ✅ MongoDB Atlas IP whitelist configured
- ✅ Database user has minimum required permissions
- ✅ Connection string uses authentication

### API Security
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Input validation on all endpoints
- ✅ Authentication required for protected routes

## 🛠️ Troubleshooting

### Common Issues

#### Frontend can't reach backend
```bash
# Check VITE_API_URL environment variable
# Verify backend is deployed and healthy
# Check browser network tab for CORS errors
```

#### Database connection fails
```bash
# Verify MongoDB Atlas IP whitelist
# Check connection string format
# Ensure database user exists and has permissions
```

#### Build failures
```bash
# Check build logs in deployment dashboard
# Verify all dependencies are in package.json
# Ensure environment variables are set
```

### Logs and Debugging

#### Vercel Logs
- Dashboard → Project → Functions tab
- Real-time logs during deployment

#### Railway Logs
- Dashboard → Project → Logs tab
- Real-time application logs

## 📊 Monitoring

### Vercel Analytics
- Automatic performance monitoring
- Available in Vercel dashboard

### Railway Metrics
- CPU, memory, and network usage
- Available in Railway dashboard

### Custom Monitoring
```javascript
// Add to backend for custom metrics
app.get('/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});
```

## 🔄 Updates and Maintenance

### Regular Updates
- Dependencies: Monthly security updates
- Environment rotation: Quarterly secret rotation
- Database backups: Automated with MongoDB Atlas

### Scaling
- **Vercel**: Automatic scaling with Edge Network
- **Railway**: Upgrade plan for higher limits
- **MongoDB Atlas**: Upgrade cluster for more storage

## 📞 Support Resources

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)