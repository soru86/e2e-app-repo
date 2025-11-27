import { useState, useEffect } from 'react';
import { queueManager } from '../utils/queueManager';

export function useOfflineQueue() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Load queue from IndexedDB
    queueManager.getQueue().then(setQueue);

    // Listen for queue updates
    const interval = setInterval(() => {
      queueManager.getQueue().then(setQueue);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addToQueue = async (type, data) => {
    await queueManager.addToQueue(type, data);
    const updatedQueue = await queueManager.getQueue();
    setQueue(updatedQueue);
  };

  const processQueue = async () => {
    const items = await queueManager.getQueue();
    for (const item of items) {
      if (item.status === 'pending') {
        try {
          await queueManager.processItem(item);
          const updatedQueue = await queueManager.getQueue();
          setQueue(updatedQueue);
        } catch (error) {
          console.error('Failed to process queue item:', error);
        }
      }
    }
  };

  return { queue, addToQueue, processQueue };
}

