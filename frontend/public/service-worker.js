const CACHE_NAME = 'smartwork-cache-v4';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install service worker 
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(urlsToCache.map((url) => cache.add(url)))
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

// Network first, cache as backup (so you always get the newest app)
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match('/index.html')))
    );
});

self.addEventListener('push', (event) => {
  let data = { title: '⏰ SmartWork Reminder', body: 'Task reminder!'};
  try {
    if (event.data) data = event.data.json();
  } catch (e) {}

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
