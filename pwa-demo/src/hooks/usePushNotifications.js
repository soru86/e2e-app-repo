import { useState, useEffect } from 'react';

export function usePushNotifications() {
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription().then((sub) => {
                    setSubscription(sub);
                });
            });
        }
    }, []);

    const subscribe = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            alert('Push notifications are not supported in this browser');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    'BP54xkmwuQlsM0EWNxLeQxn81qqlALCW2KARezJJCE_eeg-9i9Donbt8yuxiTxqXgJwew1kFwHz3L5OMNtJ0uNU'
                )
            });

            // Send subscription to server
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });

            setSubscription(sub);
            alert('Push notifications enabled!');
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
            alert('Failed to enable push notifications');
        }
    };

    const unsubscribe = async () => {
        if (subscription) {
            await subscription.unsubscribe();
            await fetch('/api/push/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });
            setSubscription(null);
            alert('Push notifications disabled!');
        }
    };

    return { subscribe, unsubscribe, subscription };
}

// Convert VAPID key from base64 URL to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

