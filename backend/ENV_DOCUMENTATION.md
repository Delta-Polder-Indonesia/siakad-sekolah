# Environment Variables Documentation

## Backend Environment Variables

Copy this file to `.env` and fill in the actual values for your environment.

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Server Configuration
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# JWT Authentication
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_jwt_secret_here_minimum_32_characters
JWT_EXPIRES_IN=8h
JWT_REFRESH_SECRET=your_refresh_token_secret_here_minimum_32_characters
JWT_REFRESH_EXPIRES_IN=7d

# Admin Panel Credentials (PPDB)
# CHANGE THESE IN PRODUCTION!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

### Optional Variables

```bash
# If not set, defaults will be used:
# PORT: 4000
# NODE_ENV: development
# CLIENT_ORIGIN: http://localhost:5173
# JWT_EXPIRES_IN: 8h
# JWT_REFRESH_EXPIRES_IN: 7d
# ADMIN_USERNAME: admin
# ADMIN_PASSWORD: admin
```

## Frontend Environment Variables

Create a `.env` file in the frontend root directory.

```bash
# Admin Credentials (Frontend)
# SECURITY WARNING: Use strong passwords in production
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=admin

# PPDB Configuration
VITE_ADMIN_MAX_ATTEMPTS=5
VITE_ADMIN_LOCK_MINUTES=15
VITE_ADMIN_SESSION_MINUTES=480
VITE_ADMIN_PIN=26012026
VITE_REGION_CODE=NAS
```

## Security Notes

1. **Never commit `.env` files to version control**
2. **Use strong, random secrets for JWT_SECRET and JWT_REFRESH_SECRET**
3. **Change default admin credentials in production**
4. **Use different credentials for development and production**
5. **Rotate secrets periodically**
6. **Use environment-specific configurations**

## Generating Secure Secrets

### JWT Secrets
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Admin Password
Use a password manager to generate strong passwords with:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, and special characters
- No dictionary words or common patterns

## Database Setup

### PostgreSQL
```bash
# Install PostgreSQL
# Create database
createdb portal_siswa

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/portal_siswa
```

### Run Migrations
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Development vs Production

### Development
```bash
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

### Production
```bash
NODE_ENV=production
CLIENT_ORIGIN=https://your-domain.com
```

## Troubleshooting

### JWT_SECRET not set error
- Ensure JWT_SECRET and JWT_REFRESH_SECRET are set in `.env`
- Secrets must be at least 32 characters long

### Database connection error
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database exists

### CORS errors
- Verify CLIENT_ORIGIN matches your frontend URL
- For multiple origins, separate with commas: `http://localhost:5173,https://example.com`
