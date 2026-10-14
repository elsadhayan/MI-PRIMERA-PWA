const CACHE_NAME = 'cafe-app-v2'; // Cambiamos la versión para forzar la actualización

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './detalle.html',
  './style.css',
  './css/style.css',
  './detalle.js',
  './manifest.json',
  './imagenes/cafe1.jpg',
  './imagenes/cafe2.jpg',
  './imagenes/cafe3.jpg',
  './imagenes/cafe4.jpg',
  './imagenes/cafe5.jpg',
  './imagenes/cafe6.jpg',
  './imagenes/cafe7.jpg',
  './imagenes/cafe8.jpg',
  './imagenes/cafe9.jpg',
  './imagenes/cafe10.jpg'
];

// Evento Install: Descarga y guarda todos los activos iniciales
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Obliga al Service Worker a activarse de inmediato
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Archivos cacheados correctamente');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Evento Activate: Elimina cachés viejas y toma el control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Evento Fetch: Estrategia Network First con respaldo en Caché + Guardado dinámico
self.addEventListener('fetch', (event) => {
  // Solo procesamos peticiones GET (imágenes, HTML, CSS, JS)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la respuesta de red es válida, la clonamos y actualizamos la caché
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si no hay internet, buscamos la petición en la caché
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si es una navegación y no encuentra la ruta exacta, entrega el index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});