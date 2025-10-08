# Railway Environment Variables Setup Guide

## Required Environment Variables for Railway

Add these in Railway Dashboard → Project → Variables:

### Core Configuration
NODE_ENV=production
PORT=3001

### Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/3scope?retryWrites=true&w=majority

### Authentication
JWT_SECRET=your-super-secure-production-jwt-secret-at-least-32-characters
JWT_EXPIRE=30d
BCRYPT_SALT_ROUNDS=12

### API Keys
CLIMATIQ_API_KEY=your-climatiq-api-key-when-ready

### Security & Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

### File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

## Notes:
- Replace 'username', 'password', 'cluster' with your MongoDB Atlas details
- Generate a strong JWT_SECRET (32+ characters)
- Add CLIMATIQ_API_KEY when you get your Climatiq account

## Testing:
Once deployed, test with:
curl https://3scope-production.up.railway.app/health

## Your Railway Domain:
https://3scope-production.up.railway.app