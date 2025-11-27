// Service Worker for offline support and background sync
const CACHE_NAME = 'pwa-demo-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Convert base64 string back to File object
function base64ToFile(base64, filename, mimeType) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mimeType || mime });
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Only cache HTTP(S) resources, skip others
      const urlsToCache = [
        '/',
        '/index.html'
      ].filter(url => {
        try {
          const urlObj = new URL(url, self.location.origin);
          return urlObj.protocol.startsWith('http');
        } catch {
          return false;
        }
      });
      
      return cache.addAll(urlsToCache).catch((error) => {
        console.warn('Some assets failed to cache:', error);
        // Continue even if some assets fail to cache
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip non-HTTP(S) requests (chrome-extension://, data:, blob:, etc.)
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip Vite dev server internal routes and HMR (development only)
  if (
    url.pathname.includes('/@vite') ||
    url.pathname.includes('/@react') ||
    url.pathname.includes('/@id') ||
    url.pathname.includes('/node_modules/')
  ) {
    // Let these pass through without caching - don't intercept
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Don't cache WebSocket connections or non-HTTP(S) schemes
          if (url.protocol === 'ws:' || url.protocol === 'wss:') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(RUNTIME_CACHE).then((cache) => {
            try {
              cache.put(event.request, responseToCache);
            } catch (error) {
              // Silently fail if caching is not possible (e.g., chrome-extension://)
              console.warn('Failed to cache request:', event.request.url, error);
            }
          });

          return response;
        })
        .catch(() => {
          // Return offline page if available
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

// Background sync for queued operations
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-queue') {
    event.waitUntil(syncQueue());
  }
});

async function syncQueue() {
  try {
    // Get queue from IndexedDB
    const queue = await getQueueFromIndexedDB();
    
    for (const item of queue) {
      if (item.status === 'pending') {
        try {
          await processQueueItem(item);
        } catch (error) {
          console.error('Failed to sync item:', error);
        }
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

function getQueueFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OfflineQueueDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['queue'], 'readonly');
      const store = transaction.objectStore('queue');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || []);
      };
      
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function processQueueItem(item) {
  let response;
  
  if (item.type === 'form') {
    response = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.data)
    });
      } else if (item.type === 'upload') {
        // Convert base64 back to File
        const file = base64ToFile(item.data.fileData, item.data.filename, item.data.type);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', item.data.filename);

        response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
      }

  if (response && response.ok) {
    // Update item status in IndexedDB
    await updateQueueItemStatus(item.id, 'completed');
  }
}

function updateQueueItemStatus(id, status) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OfflineQueueDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['queue'], 'readwrite');
      const store = transaction.objectStore('queue');
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.status = status;
          const putRequest = store.put(item);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('PWA Demo', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Message received in SW:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SYNC_QUEUE') {
    syncQueue();
  }
});

