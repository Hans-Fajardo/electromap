// const CACHE_NAME = 'my-app-cache-v1';

// // Install Event: No need to cache everything at once; we'll dynamically cache as needed.
// self.addEventListener('install', (event) => {
//   console.log('Service Worker installed');
//   self.skipWaiting(); // Forces the service worker to become active immediately after installation.
// });

// // Activate Event: Clean up old caches
// self.addEventListener('activate', (event) => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!cacheWhitelist.includes(cacheName)) {
//             console.log(`Deleting old cache: ${cacheName}`);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// // Fetch Event: Handle dynamic caching
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       // Serve cached response if available
//       if (cachedResponse) {
//         return cachedResponse;
//       }

//       // If not in cache, fetch from network and add to cache
//       return fetch(event.request).then((networkResponse) => {
//         // Only cache successful responses (status 200)
//         if (networkResponse && networkResponse.status === 200) {
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, networkResponse.clone());
//           });
//         }
//         return networkResponse;
//       });
//     })
//   );
// });
