# MongoDB Setup Options for 3Scope Backend

## Option 1: MongoDB Atlas (Cloud - Recommended)

### Quick Setup (5 minutes):

1. **Create Free MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project called "3scope"

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select a cloud provider and region close to you
   - Name your cluster "3scope-cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `3scope-user`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development)
   - Or add your current IP address

5. **Get Connection String**
   - Go to "Database" and click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

6. **Update Your .env File**
   ```env
   MONGODB_URI=mongodb+srv://3scope-user:YOUR_PASSWORD@3scope-cluster.xxxxx.mongodb.net/3scope?retryWrites=true&w=majority
   ```

## Option 2: Docker (Local - Fast Alternative)

If you have Docker installed, this is much faster than Homebrew:

1. **Install Docker Desktop** (if not already installed)
   - Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

2. **Run MongoDB in Docker**
   ```bash
   docker run --name 3scope-mongodb -p 27017:27017 -d mongo:latest
   ```

3. **Your .env stays the same**
   ```env
   MONGODB_URI=mongodb://localhost:27017/3scope
   ```

4. **To stop/start later**
   ```bash
   docker stop 3scope-mongodb
   docker start 3scope-mongodb
   ```

## Option 3: Continue Homebrew Installation

If you want to continue with Homebrew (this may take 30+ minutes):

1. **Cancel current installation**
   ```bash
   # Press Ctrl+C in the terminal where it's stuck
   brew install --force-bottle mongodb-community@8.0
   ```

2. **Or try a different version**
   ```bash
   brew install mongodb-community@7.0
   ```

## Quick Test Your Database

Once you have MongoDB running (any option), test the connection:

```bash
cd /Users/jekthesnek/3scope/backend
npm run dev
```

You should see:
```
✅ MongoDB connected: your-database-url
🚀 Server running on port 5000
```

## Recommended: Use MongoDB Atlas

For development, I strongly recommend **Option 1 (MongoDB Atlas)** because:
- ✅ Takes 5 minutes to set up
- ✅ No local installation issues
- ✅ Free tier with 512MB storage
- ✅ Automatic backups and security
- ✅ Easy to share with team members
- ✅ Production-ready scaling path

Would you like me to help you set up MongoDB Atlas, or do you prefer one of the other options?