#!/bin/bash

echo "🚀 Starting 3Scope Backend Setup..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the backend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOL
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/3scope

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
JWT_EXPIRE=30d

# Security Configuration
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Report Generation
REPORT_GENERATION_TIMEOUT=300000
MAX_REPORT_SIZE=52428800
EOL
    echo "✅ Created .env file with default configuration"
    echo "⚠️  Please update the values in .env before starting the server"
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
if [ ! -d "uploads" ]; then
    mkdir -p uploads/reports
    mkdir -p uploads/avatars
    echo "✅ Created uploads directories"
fi

# Check if MongoDB is running (optional check)
echo "🔍 Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.stats()" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB might not be running. Please start MongoDB before running the server."
    fi
elif command -v mongo &> /dev/null; then
    if mongo --eval "db.stats()" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB might not be running. Please start MongoDB before running the server."
    fi
else
    echo "⚠️  MongoDB CLI not found. Please ensure MongoDB is installed and running."
fi

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and update the .env file with your configurations"
echo "2. Ensure MongoDB is running on your system"
echo "3. Run 'npm run dev' to start the development server"
echo "4. The server will be available at http://localhost:5000"
echo ""
echo "Available scripts:"
echo "  npm run dev     - Start development server with nodemon"
echo "  npm start       - Start production server"
echo "  npm test        - Run tests"
echo ""