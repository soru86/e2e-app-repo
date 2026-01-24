import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForToken } from '../services/googleAuth';

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError(`Authorization failed: ${errorParam}`);
        setLoading(false);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setLoading(false);
        return;
      }

      try {
        await exchangeCodeForToken(code);
        // Redirect to dashboard after successful token exchange
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Completing authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={() => navigate('/')}
          style={styles.button}
        >
          Return to Login
        </button>
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
    textAlign: 'center',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
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
  },
};
