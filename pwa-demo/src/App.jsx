import React, { useState, useEffect } from 'react';
import FormComponent from './components/FormComponent';
import FileUploadComponent from './components/FileUploadComponent';
import NotificationComponent from './components/NotificationComponent';
import { useOfflineQueue } from './hooks/useOfflineQueue';
import { usePushNotifications } from './hooks/usePushNotifications';
import { useOnlineStatus } from './hooks/useOnlineStatus';

function App() {
  const [notifications, setNotifications] = useState([]);
  const isOnline = useOnlineStatus();
  const { queue, processQueue } = useOfflineQueue();
  const { subscribe, unsubscribe } = usePushNotifications();

  useEffect(() => {
    // Process queue when coming back online
    if (isOnline) {
      processQueue();
    }
  }, [isOnline, processQueue]);

  const addNotification = (type, title, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>PWA Demo Application</h1>
        <div className={`status-indicator ${isOnline ? 'status-online' : 'status-offline'}`}>
          {isOnline ? '🟢 Online' : '🔴 Offline'}
        </div>
      </div>

      {queue.length > 0 && (
        <div className="queue-status">
          <h3>Pending Operations ({queue.length})</h3>
          {queue.map((item, index) => (
            <div key={index} className="queue-item">
              <span>{item.type}: {item.data.name || item.data.filename || 'Operation'}</span>
              <span>{item.status}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <button onClick={subscribe} style={{ marginRight: '10px' }}>
          Enable Push Notifications
        </button>
        <button onClick={unsubscribe}>
          Disable Push Notifications
        </button>
      </div>

      <FormComponent onSuccess={(data) => addNotification('success', 'Form Saved', 'Your form has been saved successfully!')} />
      
      <FileUploadComponent onSuccess={(data) => addNotification('success', 'File Uploaded', `File ${data.filename} uploaded successfully!`)} />

      <NotificationComponent notifications={notifications} />
    </div>
  );
}

export default App;

