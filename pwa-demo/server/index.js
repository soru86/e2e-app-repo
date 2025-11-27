import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import webpush from 'web-push';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Store subscriptions (in production, use a database)
const subscriptions = [];

// VAPID keys (in production, store these securely in environment variables)
// Generate keys using: npm run generate-vapid
// IMPORTANT: Public and private keys must be from the same key pair!
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || 'BP54xkmwuQlsM0EWNxLeQxn81qqlALCW2KARezJJCE_eeg-9i9Donbt8yuxiTxqXgJwew1kFwHz3L5OMNtJ0uNU',
    privateKey: process.env.VAPID_PRIVATE_KEY || 'g1A00j0LLessA-oTSyZd-HZFtuboF7CdOjFMOisFtQo'
};

webpush.setVapidDetails(
    'mailto:your-email@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0' });
});

// Version check endpoint
app.get('/api/version', (req, res) => {
    res.json({ version: '1.0.0', updateAvailable: false });
});

// Form submission endpoint
app.post('/api/forms', (req, res) => {
    const { name, email, message } = req.body;

    console.log('Form submitted:', { name, email, message });

    // Simulate processing delay
    setTimeout(() => {
        res.json({
            success: true,
            message: 'Form submitted successfully',
            data: { name, email, message }
        });

        // Send push notification to all subscribers
        sendPushNotification({
            title: 'New Form Submission',
            body: `Form submitted by ${name}`,
            data: { type: 'form', name, email }
        });
    }, 500);
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File uploaded:', req.file.filename);

    res.json({
        success: true,
        message: 'File uploaded successfully',
        filename: req.file.filename,
        size: req.file.size,
        path: req.file.path
    });

    // Send push notification
    sendPushNotification({
        title: 'File Uploaded',
        body: `File ${req.file.originalname} uploaded successfully`,
        data: { type: 'upload', filename: req.file.filename }
    });
});

// Push notification subscription
app.post('/api/push/subscribe', (req, res) => {
    const subscription = req.body;

    // Check if subscription already exists
    const exists = subscriptions.some(
        sub => sub.endpoint === subscription.endpoint
    );

    if (!exists) {
        subscriptions.push(subscription);
        console.log('New subscription added:', subscription.endpoint);
    }

    res.json({ success: true, message: 'Subscription saved' });
});

// Push notification unsubscribe
app.post('/api/push/unsubscribe', (req, res) => {
    const subscription = req.body;

    const index = subscriptions.findIndex(
        sub => sub.endpoint === subscription.endpoint
    );

    if (index > -1) {
        subscriptions.splice(index, 1);
        console.log('Subscription removed:', subscription.endpoint);
    }

    res.json({ success: true, message: 'Unsubscribed' });
});

// Send push notification to all subscribers
function sendPushNotification(payload) {
    const notificationPayload = JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        data: payload.data
    });

    const promises = subscriptions.map(subscription => {
        return webpush.sendNotification(subscription, notificationPayload)
            .catch(error => {
                console.error('Error sending push notification:', error);
                // Remove invalid subscriptions
                if (error.statusCode === 410 || error.statusCode === 404) {
                    const index = subscriptions.findIndex(
                        sub => sub.endpoint === subscription.endpoint
                    );
                    if (index > -1) {
                        subscriptions.splice(index, 1);
                    }
                }
            });
    });

    return Promise.all(promises);
}

// Endpoint to trigger push notification (for testing)
app.post('/api/push/send', (req, res) => {
    const { title, body, data } = req.body;

    sendPushNotification({ title, body, data });

    res.json({ success: true, message: 'Push notification sent' });
});

// Endpoint to simulate server state change
app.post('/api/state-change', (req, res) => {
    const { message } = req.body;

    sendPushNotification({
        title: 'Server State Changed',
        body: message || 'A change occurred on the server',
        data: { type: 'state-change' }
    });

    res.json({ success: true, message: 'State change notification sent' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

