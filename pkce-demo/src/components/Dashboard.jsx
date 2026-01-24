import { useEffect, useState } from 'react';
import { getUserInfo, getAccessToken, logout } from '../services/googleAuth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error('No access token found');
        }
        const userInfo = await getUserInfo(accessToken);
        setUser(userInfo);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loading}>Loading user data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.error}>
            <strong>Error:</strong> {error}
          </div>
          <button onClick={logout} style={styles.button}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome!</h1>
        <div style={styles.userInfo}>
          {user?.picture && (
            <img
              src={user.picture}
              alt={user.name}
              style={styles.avatar}
            />
          )}
          <h2 style={styles.name}>{user?.name}</h2>
          <p style={styles.email}>{user?.email}</p>
          {user?.verified_email && (
            <span style={styles.verified}>✓ Verified Account</span>
          )}
        </div>

        <div style={styles.details}>
          <h3 style={styles.detailsTitle}>User Details:</h3>
          <div style={styles.detailRow}>
            <strong>ID:</strong> {user?.id}
          </div>
          <div style={styles.detailRow}>
            <strong>Locale:</strong> {user?.locale || 'N/A'}
          </div>
        </div>

        <button onClick={logout} style={styles.logoutButton}>
          Sign Out
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
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center',
  },
  userInfo: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '15px',
    border: '3px solid #667eea',
  },
  name: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
  },
  email: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '8px',
  },
  verified: {
    display: 'inline-block',
    fontSize: '14px',
    color: '#4caf50',
    fontWeight: '500',
  },
  details: {
    marginTop: '30px',
    paddingTop: '30px',
    borderTop: '1px solid #eee',
  },
  detailsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  detailRow: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
    lineHeight: '1.6',
  },
  logoutButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: '#dc3545',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s',
    marginTop: '30px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
    padding: '40px',
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
