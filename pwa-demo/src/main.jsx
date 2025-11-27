import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker manually
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
        
        // Check server version
        checkVersion();
        setInterval(checkVersion, 300000); // Check every 5 minutes
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Check for app version updates
async function checkVersion() {
  try {
    const response = await fetch('/api/version');
    const data = await response.json();
    
    if (data.updateAvailable) {
      showUpdateNotification(data.version);
    }
  } catch (error) {
    console.error('Version check failed:', error);
  }
}

// Show update notification
function showUpdateNotification(version) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('App Update Available', {
      body: version 
        ? `Version ${version} is now available. Click to reload.`
        : 'A new version of the app is available. Click to reload.',
      icon: '/pwa-192x192.png',
      tag: 'app-update',
      requireInteraction: true
    }).onclick = () => {
      window.location.reload();
    };
  } else {
    if (window.confirm('New version available! Reload now?')) {
      window.location.reload();
    }
  }
}

