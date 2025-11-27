# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Generate VAPID Keys
```bash
npm run generate-vapid
```

Copy the generated keys and update `server/index.js`:
```javascript
const vapidKeys = {
  publicKey: 'YOUR_PUBLIC_KEY_HERE',
  privateKey: 'YOUR_PRIVATE_KEY_HERE'
};
```

Also update `src/hooks/usePushNotifications.js` with the same public key.

## 3. Start Development Server
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 4. Test the Application

### Test Offline Mode:
1. Open http://localhost:3000 in Chrome
2. Open DevTools (F12) > Network tab
3. Check "Offline" checkbox
4. Submit the form or upload a file
5. See the operation queued
6. Uncheck "Offline" to go back online
7. Watch the queue process automatically

### Test Push Notifications:
1. Click "Enable Push Notifications" button
2. Allow notifications when prompted
3. Submit a form or upload a file
4. You should receive a push notification

### Test Version Updates:
```bash
# Simulate a version update
curl -X POST http://localhost:3001/api/state-change \
  -H "Content-Type: application/json" \
  -d '{"message": "Server state has changed!"}'
```

## Features Implemented

✅ **Offline Mode**: Service worker caches assets and enables offline functionality
✅ **Operation Queuing**: Forms and file uploads queued in IndexedDB when offline
✅ **Auto Sync**: Queue automatically processes when connection is restored
✅ **Push Notifications**: Server can send push notifications for state changes
✅ **Version Checking**: App checks for updates and notifies users
✅ **Background Sync**: Service worker handles background synchronization

