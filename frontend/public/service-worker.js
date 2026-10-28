const CACHE_NAME = 'smartwork-cache-v1';
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
    const options = {
        body: event.data ? event.data.text() : 'Task reminder!',
        icon: '/logo192.png',
        badge: '/logo192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'complete',
                title: '✅ Complete Task'
            },
            {
                action: 'snooze',
                title: '😴 Snooze'
            }
        ]
    };
    event.waitUntil(
        self.registration.showNotification('SmartWork Reminder', options)
    );
});