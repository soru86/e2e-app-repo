# Google OAuth Setup Guide for PKCE Flow

This guide provides step-by-step instructions to configure Google OAuth for PKCE flow (public client, no client_secret).

## Step-by-Step Configuration

### 1. Create/Select Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Either select an existing project or click **"New Project"**
4. Enter a project name and click **"Create"**

### 2. Enable Required APIs

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click on it and click **"Enable"**
4. (Optional) Also enable **"Google Identity Services API"** for better support

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace account)
3. Fill in the required fields:
   - **App name**: Your app name
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **"Save and Continue"**
5. On **"Scopes"** page, click **"Save and Continue"** (default scopes are fine)
6. On **"Test users"** page (if in testing), add test users or click **"Save and Continue"**
7. Review and go back to dashboard

### 4. Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen first (see step 3)
4. In the **"Application type"** dropdown, select **"Web application"**
5. **Name**: Give it a name (e.g., "PKCE Demo App")
6. **Authorized JavaScript origins**: 
   - Add: `http://localhost:3000`
   - (For production, add your production domain)
7. **Authorized redirect URIs**: 
   - Add: `http://localhost:3000/callback`
   - ⚠️ **CRITICAL**: This must match EXACTLY with your app's redirect URI
   - No trailing slash, exact protocol (http/https), exact port
8. Click **"Create"**

### 5. Copy Client ID (NOT Client Secret)

1. A popup will appear showing:
   - **Your Client ID**: `xxxxx.apps.googleusercontent.com` ← Copy this!
   - **Your Client Secret**: `xxxxx` ← **DO NOT USE THIS!**
2. Copy only the **Client ID**
3. Close the popup

### 6. Configure Your Application

1. Create `.env` file in your project root:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   VITE_REDIRECT_URI=http://localhost:3000/callback
   ```

2. **Important**: 
   - Use the Client ID you copied
   - The redirect URI must match EXACTLY what you entered in step 4
   - Do NOT add client_secret to your `.env` file

## Common Configuration Mistakes

### ❌ Wrong: Including Client Secret
```env
# DON'T DO THIS!
VITE_GOOGLE_CLIENT_SECRET=xxxxx  # ❌ Not needed for PKCE
```

### ✅ Correct: Only Client ID
```env
# DO THIS!
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com  # ✅
```

### ❌ Wrong: Redirect URI Mismatch
```
Google Console: http://localhost:3000/callback/
Your .env:      http://localhost:3000/callback
# ❌ Trailing slash mismatch!
```

### ✅ Correct: Exact Match
```
Google Console: http://localhost:3000/callback
Your .env:      http://localhost:3000/callback
# ✅ Perfect match!
```

## Verifying Your Configuration

After setup, verify:

1. ✅ OAuth client type is **"Web application"**
2. ✅ Redirect URI in Google Console matches `.env` exactly
3. ✅ Only Client ID is in `.env` (no Client Secret)
4. ✅ JavaScript origin includes `http://localhost:3000`
5. ✅ OAuth consent screen is configured

## Testing Your Setup

1. Start your app: `npm run dev`
2. Click "Sign in with Google"
3. You should be redirected to Google login
4. After authorization, you should be redirected back to `/callback`
5. The app should exchange the code for tokens without errors

## If You Still Get "client_secret missing" Error

1. **Double-check redirect URI**: Must match character-for-character
2. **Verify client type**: Should be "Web application" (not "Desktop app" or "iOS/Android")
3. **Check OAuth consent screen**: Must be configured (even if in testing mode)
4. **Try recreating the OAuth client**: Sometimes a fresh client works better
5. **Clear browser cache**: Old tokens or state might interfere

## Production Setup

For production:

1. Update redirect URI in Google Console to your production URL:
   - `https://yourdomain.com/callback`
2. Update `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   VITE_REDIRECT_URI=https://yourdomain.com/callback
   ```
3. Ensure HTTPS is enabled (required for production)
4. Update OAuth consent screen to production mode (if ready)

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)
- [Google Identity Platform](https://developers.google.com/identity)
