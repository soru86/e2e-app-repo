// Version checker utility
let currentVersion = '1.0.0';
let checkInterval = null;

export const versionChecker = {
  start() {
    // Check version on load
    this.check();
    
    // Check every 5 minutes
    checkInterval = setInterval(() => {
      this.check();
    }, 300000);
  },

  stop() {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  },

  async check() {
    try {
      const response = await fetch('/api/version');
      const data = await response.json();
      
      if (data.version !== currentVersion && data.updateAvailable) {
        currentVersion = data.version;
        this.notifyUpdate(data.version);
      }
    } catch (error) {
      console.error('Version check failed:', error);
    }
  },

  notifyUpdate(version) {
    // Send message to service worker to show notification
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'VERSION_UPDATE',
        version
      });
    }
    
    // Also show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('App Update Available', {
        body: `Version ${version} is now available. Click to reload.`,
        icon: '/pwa-192x192.png',
        tag: 'app-update',
        requireInteraction: true
      }).onclick = () => {
        window.location.reload();
      };
    }
  }
};

