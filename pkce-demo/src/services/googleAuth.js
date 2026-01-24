import {
  generateCodeVerifier,
  generateCodeChallenge,
  storePKCEValues,
  getCodeVerifier,
  clearPKCEValues
} from '../utils/pkce.js';

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v2/userinfo';

/**
 * Initiates Google OAuth login with PKCE flow
 */
export async function initiateGoogleLogin() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/callback`;

  if (!clientId) {
    throw new Error('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.');
  }

  // Generate PKCE values
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store verifier for later use
  storePKCEValues(codeVerifier, codeChallenge);

  // Build authorization URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent'
  });

  const authUrl = `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;

  // Redirect to Google authorization server
  window.location.href = authUrl;
}

/**
 * Exchanges authorization code for access token using PKCE
 * @param {string} code - Authorization code from callback
 * @returns {Promise<Object>} Token response with access_token, id_token, etc.
 */
export async function exchangeCodeForToken(code) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/callback`;
  const codeVerifier = getCodeVerifier();

  if (!codeVerifier) {
    throw new Error('Code verifier not found. Please initiate login again.');
  }

  // For PKCE flow with public clients, client_secret is NOT required
  // Include client_id in the body (not in Basic Auth header)
  // This tells Google this is a public client PKCE flow
  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
      // Note: client_secret is intentionally omitted for public client PKCE flow
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Failed to exchange code for token';
    
    try {
      const error = JSON.parse(errorText);
      errorMessage = error.error_description || error.error || errorMessage;
      
      // Provide helpful error messages
      if (error.error === 'invalid_client') {
        errorMessage += '\n\nPossible causes:\n' +
          '1. OAuth client in Google Cloud Console may be configured as confidential client\n' +
          '2. Redirect URI does not match exactly (check trailing slashes)\n' +
          '3. OAuth client needs to be recreated as a public client for PKCE';
      } else if (error.error === 'invalid_grant') {
        errorMessage += '\n\nPossible causes:\n' +
          '1. Authorization code expired or already used\n' +
          '2. Code verifier does not match code challenge\n' +
          '3. Redirect URI mismatch';
      }
    } catch (e) {
      errorMessage += `\n\nResponse: ${errorText}`;
    }
    
    throw new Error(errorMessage);
  }

  const tokenData = await response.json();
  
  // Clear PKCE values after successful exchange
  clearPKCEValues();
  
  // Store tokens
  sessionStorage.setItem('access_token', tokenData.access_token);
  if (tokenData.refresh_token) {
    sessionStorage.setItem('refresh_token', tokenData.refresh_token);
  }
  if (tokenData.id_token) {
    sessionStorage.setItem('id_token', tokenData.id_token);
  }

  return tokenData;
}

/**
 * Fetches user information from Google API
 * @param {string} accessToken - Access token
 * @returns {Promise<Object>} User information
 */
export async function getUserInfo(accessToken) {
  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user information');
  }

  return await response.json();
}

/**
 * Checks if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!sessionStorage.getItem('access_token');
}

/**
 * Gets stored access token
 * @returns {string|null}
 */
export function getAccessToken() {
  return sessionStorage.getItem('access_token');
}

/**
 * Logs out the user
 */
export function logout() {
  sessionStorage.clear();
  window.location.href = '/';
}
