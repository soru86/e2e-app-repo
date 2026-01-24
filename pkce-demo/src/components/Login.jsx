import { useState } from 'react';
import { initiateGoogleLogin } from '../services/googleAuth';

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await initiateGoogleLogin();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>PKCE Google Login Demo</h1>
        <p style={styles.description}>
          Secure OAuth 2.0 authentication using Proof Key for Code Exchange (PKCE)
        </p>
        
        {error && (
          <div style={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Redirecting...' : 'Sign in with Google'}
        </button>

        <div style={styles.info}>
          <h3 style={styles.infoTitle}>How PKCE Works:</h3>
          <ol style={styles.infoList}>
            <li>App generates a random code verifier</li>
            <li>App creates a code challenge (SHA256 hash)</li>
            <li>User is redirected to Google with the challenge</li>
            <li>Google returns an authorization code</li>
            <li>App exchanges code + verifier for tokens</li>
            <li>Only the app with the verifier can complete the flow</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: '#4285f4',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s',
    marginBottom: '30px',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  info: {
    marginTop: '30px',
    paddingTop: '30px',
    borderTop: '1px solid #eee',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  infoList: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.8',
    paddingLeft: '20px',
  },
};
