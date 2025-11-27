# PWA Demo Application

A Progressive Web Application (PWA) with offline support, operation queuing, and push notifications.

## Features

1. **Offline Mode**: Works offline using service workers and caching
2. **Operation Queuing**: Form submissions and file uploads are queued when offline and synced when online
3. **Push Notifications**: Receive notifications for server state changes and app updates

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Service Workers**: For offline support and background sync
- **IndexedDB**: For storing queued operations
- **Web Push API**: For push notifications

## Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate VAPID keys for push notifications:
```bash
npm run generate-vapid
```

Copy the generated keys and update the `vapidKeys` object in `server/index.js` with your generated keys.

3. Create PWA icons (optional but recommended):
   - Create `public/pwa-192x192.png` (192x192 pixels)
   - Create `public/pwa-512x512.png` (512x512 pixels)
   - These icons are used for the PWA manifest and notifications

4. Start the development server:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend API on http://localhost:3001

## Usage

### Offline Mode

1. Open the application in your browser
2. Open DevTools and go to Network tab
3. Enable "Offline" mode
4. Try submitting a form or uploading a file
5. The operation will be queued
6. When you go back online, the queue will be processed automatically

### Push Notifications

1. Click "Enable Push Notifications" button
2. Allow notifications when prompted
3. Notifications will be sent when:
   - A form is submitted
   - A file is uploaded
   - Server state changes
   - New app version is available

### Testing Push Notifications

You can test push notifications by calling:
```bash
curl -X POST http://localhost:3001/api/push/send \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "body": "This is a test notification"}'
```

## Project Structure

```
pwa-demo/
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── server/
│   ├── index.js         # Express server
│   └── uploads/         # Uploaded files directory
├── public/
│   └── sw.js            # Service worker
└── package.json
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/version` - Check app version
- `POST /api/forms` - Submit form
- `POST /api/upload` - Upload file
- `POST /api/push/subscribe` - Subscribe to push notifications
- `POST /api/push/unsubscribe` - Unsubscribe from push notifications
- `POST /api/push/send` - Send push notification (testing)
- `POST /api/state-change` - Simulate server state change

## Production Build

```bash
npm run build
npm start
```

## Notes

- Service workers require HTTPS in production (localhost is exempt)
- Push notifications require user permission
- File uploads in offline mode are stored as base64 in IndexedDB and synced when online
- VAPID keys should be stored securely in production (use environment variables)
- The app automatically checks for updates every 5 minutes
- Queued operations are automatically processed when the connection is restored

## Troubleshooting

### Service Worker not registering
- Make sure you're accessing the app via `http://localhost:3000` (not file://)
- Check browser console for errors
- In Chrome DevTools > Application > Service Workers, check registration status

### Push notifications not working
- Ensure VAPID keys are properly configured in `server/index.js`
- Check that you've granted notification permissions
- Verify the subscription endpoint is working: `POST /api/push/subscribe`

### Queue not syncing
- Check browser console for errors
- Verify IndexedDB is accessible (Chrome DevTools > Application > IndexedDB)
- Ensure the service worker is active and can access the network

