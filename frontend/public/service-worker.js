const CACHE_NAME = 'smartwork-cache-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json',
    '/logo192.png',
    '/logo512.png'
];

// Install service worker 
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('✅ Cache opened');
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch from cache 
self.addEventListener('fetch', (event) => {
    event.respondwith(
        caches.match(event.request).then((response) => {
            // Return cached version or fetch from network 
            if (response) {
                return response;
            }
            return fetch(event.request).then((response) => {
                // Check valid response 
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                // Cache new response 
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        }).catch(() => {
            // Offline fallback 
            return caches.match('/index.html');
        })
    );
});

// Activate service worker 
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('✅ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Push notifications 
self.addEventListener('push', (event) => {
    let data = { title: '⏰ SmartWork Reminder', body: 'Task reminder!' };
    try {
      if (event.data) data = event.data.json();
    } catch (e) {
        // keep default message 
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
          body: data.body,
          icon: '/logo192.png',
          badge: '/logo192.png',
          vibrate: [300, 100, 300, 100, 300],
          requireInteraction: true,
          data: { taskId: data.taskId, actionToken: data.actionToken },
          actions: [{ action: 'complete', title: '✅ Complete' }]
        })
    );
});

// Handle taps on the notification 
self.addEventListener('notificatonclick', (event) => {
    event.notification.close();
    const { actionToken } = event.notification.data || {};

    if (event.action === 'complete' && actionToken) {
        event.waitUntil(
            fetch('https://smartwork-upt0.onrender.com/api/push/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actionToken })
            }).then((res) =>
                self.registration.showNotification(
                    res.ok ? '🎉 Task completed!' : '❌ Could not complete task',
                    { icon: '/logo192.png' }
                )
            )
        );
    } else {
        event.waitUntil(clients.openWindow('/'));
    }
});

// Open the app when the notification is tapped 
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});