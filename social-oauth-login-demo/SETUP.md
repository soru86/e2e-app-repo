# Setup Guide

This guide will help you set up the Social OAuth Login Demo application.

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm run install-all
```

This will install dependencies for:
- Root project (concurrently)
- Server (Express, MongoDB, Redis, Passport, etc.)
- Client (React, TailwindCSS, etc.)

### 2. Set Up Environment Variables

1. Copy the example environment file:
```bash
cp server/env.example server/.env
# Or if .env.example exists:
# cp server/.env.example server/.env
```

2. Edit `server/.env` and add your OAuth credentials.

### 3. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB if not already installed
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
# OR
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server/.env`

### 4. Set Up Redis

**Option A: Local Redis**
```bash
# Install Redis if not already installed
# macOS
brew install redis

# Start Redis
brew services start redis
# OR
redis-server
```

**Option B: Redis Cloud**
1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Create a free database
3. Get connection details
4. Update `REDIS_HOST` and `REDIS_PORT` in `server/.env`

### 5. Set Up OAuth Applications

#### Google OAuth
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret to `server/.env`

#### Facebook OAuth
1. Visit [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Go to Settings → Basic, add your domain
5. Go to Facebook Login → Settings
6. Add Valid OAuth Redirect URI: `http://localhost:5000/api/auth/facebook/callback`
7. Copy App ID and App Secret to `server/.env`

#### GitHub OAuth
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. Copy Client ID and Client Secret to `server/.env`

#### LinkedIn OAuth
1. Visit [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add redirect URL: `http://localhost:5000/api/auth/linkedin/callback`
4. Request access to: `r_emailaddress` and `r_liteprofile` (v1) OR `openid`, `profile`, `email` (v2)
5. Copy Client ID and Client Secret to `server/.env`

### 6. Generate Secrets

Generate secure random strings for:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SESSION_SECRET`

You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 7. Run the Application

```bash
# Start both server and client
npm run dev
```

Or separately:
```bash
# Terminal 1
npm run server

# Terminal 2
npm run client
```

### 8. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

### Redis Connection Issues
- Ensure Redis is running
- Check `REDIS_HOST` and `REDIS_PORT` in `.env`
- Test connection: `redis-cli ping`

### OAuth Errors
- Verify redirect URIs match exactly
- Check client IDs and secrets
- Ensure OAuth apps are properly configured
- Check browser console for errors

### Port Already in Use
- Change `PORT` in `server/.env` (server)
- Change port in `client/package.json` scripts (client)

## Next Steps

1. Test each OAuth provider
2. Verify user data is saved in MongoDB
3. Check tokens are stored in Redis
4. Test refresh token functionality
5. Test logout functionality

## Production Deployment

Before deploying to production:

1. Change all secrets to strong, random values
2. Update OAuth redirect URIs to production URLs
3. Set `NODE_ENV=production`
4. Enable HTTPS
5. Configure CORS properly
6. Set secure cookie flags
7. Use environment variables for all sensitive data
8. Enable rate limiting
9. Set up monitoring and logging
10. Configure MongoDB and Redis for production
