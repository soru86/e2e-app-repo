# Social OAuth Login Demo

A full-stack application implementing OAuth2 social login with Google, Facebook, GitHub, and LinkedIn. Built with React.js, Node.js, Express.js, MongoDB, and Redis.

## Features

- ✅ OAuth2 authentication with 4 providers:
  - Google
  - Facebook
  - GitHub
  - LinkedIn
- ✅ JWT-based authentication with access and refresh tokens
- ✅ Redis caching for session and token management
- ✅ MongoDB for user data storage
- ✅ Modern UI with TailwindCSS
- ✅ Proper error handling
- ✅ Protected routes
- ✅ Token refresh mechanism

## Tech Stack

### Frontend
- React.js 18
- TailwindCSS 3
- React Router DOM
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- Passport.js (OAuth strategies)
- MongoDB (Mongoose)
- Redis
- JWT

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- Redis (running locally or connection string)
- Git

## OAuth Provider Setup

You'll need to create OAuth applications for each provider and get client IDs and secrets:

### 1. Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

### 2. Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Add redirect URI: `http://localhost:5000/api/auth/facebook/callback`

### 3. GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:5000/api/auth/github/callback`

### 4. LinkedIn OAuth
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add redirect URL: `http://localhost:5000/api/auth/linkedin/callback`
4. Request access to: `r_emailaddress`, `r_liteprofile`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd social-oauth-login-demo
```

2. Install all dependencies:
```bash
npm run install-all
```

Or install separately:
```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

3. Set up environment variables:

Copy the example env file:
```bash
cp server/env.example server/.env
# Or if you have .env.example:
# cp server/.env.example server/.env
```

Edit `server/.env` and fill in your OAuth credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-oauth-demo
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
SESSION_SECRET=your-session-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
FRONTEND_URL=http://localhost:3000
```

4. Start MongoDB and Redis:
```bash
# MongoDB (if running locally)
mongod

# Redis (if running locally)
redis-server
```

5. Run the application:

```bash
# Run both server and client concurrently
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Server
npm run server

# Terminal 2 - Client
npm run client
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
social-oauth-login-demo/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express backend
│   ├── config/            # Configuration files
│   ├── middleware/        # Auth middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/facebook` - Initiate Facebook OAuth
- `GET /api/auth/facebook/callback` - Facebook OAuth callback
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/github/callback` - GitHub OAuth callback
- `GET /api/auth/linkedin` - Initiate LinkedIn OAuth
- `GET /api/auth/linkedin/callback` - LinkedIn OAuth callback
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### User
- `GET /api/user/me` - Get current user profile (Protected)

## Error Handling

The application includes comprehensive error handling:
- Invalid or expired tokens
- OAuth provider errors
- Database connection errors
- Redis connection errors
- Network errors

All errors are properly caught and returned with appropriate HTTP status codes and error messages.

## Security Features

- JWT token-based authentication
- Refresh token rotation
- Secure session management with Redis
- CORS configuration
- Environment variable protection
- Token expiration handling

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
