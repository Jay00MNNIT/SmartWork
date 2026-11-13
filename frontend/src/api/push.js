import { getToken } from './auth';

const BASE_URL = 'https://smartwork-upt0.onrender.com';

// Convert the public key to the format the browser needs 
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

export const enableNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Notifications are not supported on this device');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error('Notfication permission was denied');
    }

    const registration = await navigator.serviceWorker.ready;

    const keyResponse = await fetch(`${BASE_URL}/api/push/public-key`);
    const { publicKey } = await keyResponse.json();

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
    }

    const response = await fetch(`${BASE_URL}/api/push/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify(subscription)
    });

    if (!response.ok) {
        throw new Error('Could not save subscription');
    }
};

// Check if this device is already subscribed 
export const isSubscribed = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window))
        return false;
    if (Notification.permission !== 'granted')
        return false;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
};

// Turn notifications off for this device 
export const disableNotifications = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription)  
        return;

    await fetch(`${BASE_URL}/api/push/unsubscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ endpoint: subscription.endpoint })
    });

    await subscription.unsubscribe();
};