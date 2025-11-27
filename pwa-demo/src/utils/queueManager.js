// Queue Manager using IndexedDB
const DB_NAME = 'OfflineQueueDB';
const DB_VERSION = 1;
const STORE_NAME = 'queue';

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

let db = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

const getDB = async () => {
  if (!db) {
    db = await openDB();
  }
  return db;
};

export const queueManager = {
  async addToQueue(type, data) {
    const database = await getDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const item = {
      type,
      data,
      status: 'pending',
      timestamp: Date.now(),
      retries: 0
    };

    return new Promise((resolve, reject) => {
      const request = store.add(item);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getQueue() {
    const database = await getDB();
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async processItem(item) {
    try {
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
        // Mark as completed
        await this.updateItemStatus(item.id, 'completed');
        return true;
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      // Increment retries
      item.retries = (item.retries || 0) + 1;
      if (item.retries >= 3) {
        await this.updateItemStatus(item.id, 'failed');
      } else {
        await this.updateItemStatus(item.id, 'pending', item.retries);
      }
      throw error;
    }
  },

  async updateItemStatus(id, status, retries = null) {
    const database = await getDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.status = status;
          if (retries !== null) {
            item.retries = retries;
          }
          const putRequest = store.put(item);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  },

  async removeItem(id) {
    const database = await getDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};

