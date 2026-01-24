/**
 * PKCE (Proof Key for Code Exchange) Utility Functions
 * Implements RFC 7636 for secure OAuth 2.0 authorization
 */

/**
 * Generates a cryptographically random string for code verifier
 * @param {number} length - Length of the code verifier (43-128 characters)
 * @returns {string} Base64URL encoded code verifier
 */
export function generateCodeVerifier(length = 128) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => charset[byte % charset.length]).join('');
}

/**
 * Generates code challenge from code verifier using SHA256
 * @param {string} verifier - The code verifier
 * @returns {Promise<string>} Base64URL encoded code challenge
 */
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  // Convert ArrayBuffer to base64url string
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Stores PKCE values in sessionStorage
 * @param {string} verifier - Code verifier
 * @param {string} challenge - Code challenge
 */
export function storePKCEValues(verifier, challenge) {
  sessionStorage.setItem('pkce_verifier', verifier);
  sessionStorage.setItem('pkce_challenge', challenge);
}

/**
 * Retrieves code verifier from sessionStorage
 * @returns {string|null} Code verifier or null if not found
 */
export function getCodeVerifier() {
  return sessionStorage.getItem('pkce_verifier');
}

/**
 * Clears PKCE values from sessionStorage
 */
export function clearPKCEValues() {
  sessionStorage.removeItem('pkce_verifier');
  sessionStorage.removeItem('pkce_challenge');
}
