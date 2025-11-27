import React, { useState } from 'react';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

// Convert file to base64 for IndexedDB storage
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

function FileUploadComponent({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const isOnline = useOnlineStatus();
  const { addToQueue } = useOfflineQueue();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      if (isOnline) {
        // Try to upload directly
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          onSuccess && onSuccess(result);
          setFile(null);
          e.target.reset();
        } else {
          throw new Error('Failed to upload file');
        }
      } else {
        // Convert file to base64 for storage
        const base64 = await fileToBase64(file);
        await addToQueue('upload', {
          fileData: base64,
          filename: file.name,
          size: file.size,
          type: file.type
        });
        onSuccess && onSuccess({ filename: file.name, queued: true });
        setFile(null);
        e.target.reset();
      }
    } catch (error) {
      // If online but request failed, add to queue
      if (isOnline) {
        const base64 = await fileToBase64(file);
        await addToQueue('upload', {
          fileData: base64,
          filename: file.name,
          size: file.size,
          type: file.type
        });
        onSuccess && onSuccess({ filename: file.name, queued: true });
        setFile(null);
        e.target.reset();
      } else {
        alert('Failed to upload file. It has been queued for later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <div className="file-upload" onClick={() => document.getElementById('file-input').click()}>
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            required
          />
          {file ? (
            <p>Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
          ) : (
            <p>Click to select a file</p>
          )}
        </div>

        <button type="submit" disabled={loading || !file} style={{ marginTop: '15px' }}>
          {loading ? 'Uploading...' : isOnline ? 'Upload' : 'Queue Upload (Offline)'}
        </button>
      </form>
    </div>
  );
}

export default FileUploadComponent;

