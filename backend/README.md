# 3Scope Backend API

A comprehensive Node.js backend for the 3Scope ESG emissions tracking platform.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Emissions Management**: Complete CRUD operations for Scope 1, 2, and 3 emissions
- **Supply Chain Network**: Supplier relationship management and network visualization
- **Reports Generation**: Automated ESG report generation with multiple formats
- **Dashboard Analytics**: Real-time data aggregation and insights
- **Security**: Comprehensive security middleware including rate limiting, CORS, and input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **File Upload**: multer
- **Testing**: Jest

## Quick Start

1. **Installation**
   ```bash
   ./setup.sh
   ```

2. **Environment Configuration**
   Update the `.env` file with your configurations:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/3scope
   JWT_SECRET=your-super-secure-jwt-secret
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the API**
   The server will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update user preferences

### Emissions
- `GET /api/emissions` - Get user's emissions data
- `POST /api/emissions` - Create new emission record
- `PUT /api/emissions/:id` - Update emission record
- `DELETE /api/emissions/:id` - Delete emission record
- `GET /api/emissions/analytics` - Get emissions analytics

### Suppliers
- `GET /api/suppliers` - Get supplier network
- `POST /api/suppliers` - Add new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Remove supplier
- `GET /api/suppliers/network` - Get network visualization data
- `GET /api/suppliers/analytics` - Get supplier analytics

### Reports
- `GET /api/reports` - Get user's reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/:id/download` - Download report

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview data

## Database Models

### User
- Authentication and profile information
- Role-based permissions
- User preferences and settings

### Emission
- Comprehensive emissions data for all scopes
- Activity data and calculation methods
- Reporting periods and verification status

### Supplier
- Company information and relationships
- Emissions data and performance metrics
- Network connections and collaboration status

### Report
- Generated reports with metadata
- Report parameters and status tracking
- File information and download history

## Security Features

- **Authentication**: JWT token-based authentication
- **Authorization**: Role-based access control
- **Rate Limiting**: Configurable request rate limiting
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js security headers
- **CORS**: Cross-origin resource sharing configuration
- **Password Hashing**: bcryptjs with configurable salt rounds

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/3scope |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 30d |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | 12 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX` | Max requests per window | 100 |

## Development

### Available Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint
npm audit fix    # Fix security vulnerabilities
```

### Testing

```bash
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test -- --coverage     # Run tests with coverage
```

### Project Structure

```
backend/
├── models/              # Database models
│   ├── User.js
│   ├── Emission.js
│   ├── Supplier.js
│   └── Report.js
├── routes/              # API routes
│   ├── auth.js
│   ├── emissions.js
│   ├── suppliers.js
│   ├── reports.js
│   └── dashboard.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   └── errorHandler.js
├── uploads/             # File uploads
├── server.js            # Main server file
├── package.json
└── .env
```

## Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Configure production MongoDB URI
   - Set secure JWT secret
   - Configure email settings for notifications

2. **Security Considerations**
   - Use HTTPS in production
   - Configure proper CORS origins
   - Set up MongoDB authentication
   - Enable MongoDB replica sets for reliability
   - Configure proper rate limiting
   - Set up monitoring and logging

3. **Performance Optimization**
   - Enable compression middleware
   - Configure MongoDB indexes
   - Set up caching strategies
   - Monitor memory usage and performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.