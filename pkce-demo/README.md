# PKCE Google Login Demo

A secure React.js Single Page Application (SPA) demonstrating Google OAuth 2.0 authentication using the Proof Key for Code Exchange (PKCE) flow.

## Features

- ✅ Secure PKCE flow implementation (RFC 7636)
- ✅ Google OAuth 2.0 integration
- ✅ Modern React.js with React Router
- ✅ Beautiful, responsive UI
- ✅ Token management and user profile display

## What is PKCE?

PKCE (Proof Key for Code Exchange) is a security extension to OAuth 2.0 designed to protect authorization codes in public clients (like SPAs). It prevents authorization code interception attacks by:

1. Generating a random code verifier
2. Creating a code challenge (SHA256 hash of the verifier)
3. Sending only the challenge to the authorization server
4. Exchanging the authorization code with the original verifier
5. Only the app with the verifier can complete the token exchange

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:3000/callback`
7. Copy your Client ID

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_REDIRECT_URI=http://localhost:3000/callback
```

### 4. Run the Application

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Project Structure

```
pkce-demo/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page component
│   │   ├── Dashboard.jsx      # User dashboard after login
│   │   └── Callback.jsx        # OAuth callback handler
│   ├── services/
│   │   └── googleAuth.js       # Google OAuth service with PKCE
│   ├── utils/
│   │   └── pkce.js             # PKCE utility functions
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## How It Works

1. **User clicks "Sign in with Google"**
   - App generates a random code verifier
   - App creates a SHA256 hash (code challenge)
   - User is redirected to Google with the challenge

2. **User authorizes the app**
   - Google redirects back with an authorization code
   - Callback component receives the code

3. **Token Exchange**
   - App sends authorization code + code verifier to Google
   - Google validates and returns access token
   - App stores tokens and fetches user info

4. **Dashboard Display**
   - App displays user profile information
   - User can sign out

## Security Features

- ✅ PKCE flow prevents authorization code interception
- ✅ Code verifier stored in sessionStorage (not localStorage)
- ✅ HTTPS required for production
- ✅ No client secret needed (public client)

## Troubleshooting

### "client_secret missing" Error

If you're getting a `client_secret missing` error during token exchange, this means Google is treating your OAuth client as a confidential client instead of a public client. Here's how to fix it:

**Solution 1: Verify OAuth Client Configuration**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Check the **Application type** - it should be **"Web application"**
5. **Important**: Make sure your redirect URI matches EXACTLY:
   - Check for trailing slashes: `http://localhost:3000/callback` (not `/callback/`)
   - Check protocol: `http://` vs `https://`
   - Check port number: `:3000` must match exactly

**Solution 2: Recreate OAuth Client (if needed)**

If the above doesn't work, create a new OAuth client:

1. Delete the old OAuth client (or create a new one)
2. Application type: **"Web application"**
3. **Authorized redirect URIs**: Add `http://localhost:3000/callback` (exact match)
4. **Important**: Do NOT use the client_secret anywhere in your code
5. Copy only the **Client ID** (not the client secret)

**Solution 3: Verify Environment Variables**

Ensure your `.env` file has the correct values:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_REDIRECT_URI=http://localhost:3000/callback
```

**Why this happens:**

- Google's OAuth 2.0 supports both confidential clients (with client_secret) and public clients (without client_secret)
- For SPAs using PKCE, you MUST use a public client (no client_secret)
- If Google detects a mismatch or the client was configured incorrectly, it may require client_secret
- The redirect URI must match exactly between your app and Google Cloud Console

**Key Points for PKCE Flow:**

- ✅ **DO** include: `client_id`, `code`, `redirect_uri`, `grant_type`, `code_verifier`
- ❌ **DON'T** include: `client_secret` (not needed for public client PKCE)
- ✅ Redirect URI must match exactly in Google Cloud Console
- ✅ Use the same redirect URI in both authorization request and token exchange

### Other Common Errors

**"redirect_uri_mismatch"**
- Ensure the redirect URI in `.env` matches exactly with Google Cloud Console
- Check for trailing slashes, protocol (http/https), and port numbers

**"invalid_grant"**
- Authorization code expired (codes expire in ~1-10 minutes)
- Code verifier doesn't match code challenge
- Authorization code was already used (codes are single-use)

**"invalid_client"**
- Client ID is incorrect
- OAuth client was deleted or disabled in Google Cloud Console

## Production Deployment

For production:

1. Update `.env` with production redirect URI
2. Add production redirect URI in Google Cloud Console
3. Ensure HTTPS is enabled
4. Build the application: `npm run build`
5. Deploy the `dist` folder to your hosting service

## License

MIT
