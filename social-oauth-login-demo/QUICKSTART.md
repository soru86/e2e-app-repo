# Quick Start Guide

Get the application running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) installed
- ✅ MongoDB running (local or Atlas)
- ✅ Redis running (local or cloud)
- ✅ OAuth app credentials (at least one provider)

## Quick Setup

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment
```bash
cp server/env.example server/.env
# Or if .env.example exists:
# cp server/.env.example server/.env
# Edit server/.env with your OAuth credentials
```

**Minimum Required Variables:**
- `MONGODB_URI` - MongoDB connection string
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- At least ONE OAuth provider (Google, Facebook, GitHub, or LinkedIn)
- `JWT_SECRET` - Random string for JWT signing
- `JWT_REFRESH_SECRET` - Random string for refresh tokens
- `SESSION_SECRET` - Random string for sessions

### 3. Start Services

**MongoDB:**
```bash
mongod  # or brew services start mongodb-community
```

**Redis:**
```bash
redis-server  # or brew services start redis
```

### 4. Run Application
```bash
npm run dev
```

### 5. Open Browser
Navigate to: `http://localhost:3000`

## Testing OAuth Providers

1. Click any OAuth login button (Google, Facebook, GitHub, LinkedIn)
2. Complete OAuth flow on provider's site
3. You'll be redirected back to the dashboard
4. Your profile will be displayed

## Quick Test Checklist

- [ ] Server starts without errors
- [ ] Client starts without errors  
- [ ] MongoDB connection successful
- [ ] Redis connection successful
- [ ] Can click OAuth login button
- [ ] OAuth redirect works
- [ ] User data saved in MongoDB
- [ ] Dashboard displays user info
- [ ] Logout works
- [ ] Refresh token works (wait 15 minutes or manually expire token)

## Common Issues

**"MongoDB connection error"**
→ Check MongoDB is running and `MONGODB_URI` is correct

**"Redis Client Error"**
→ Check Redis is running and `REDIS_HOST/PORT` are correct

**"OAuth callback failed"**
→ Verify redirect URI matches exactly in OAuth app settings

**"Port already in use"**
→ Change `PORT` in `server/.env` or kill process using the port

## Next Steps

- Set up all 4 OAuth providers
- Test refresh token mechanism
- Review error handling
- Customize UI/UX
- Deploy to production (see SETUP.md)

For detailed setup instructions, see [SETUP.md](./SETUP.md)
