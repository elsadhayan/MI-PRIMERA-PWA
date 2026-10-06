const CACHE_NAME = 'cafe-app-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
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

// Evento Install: Guarda los archivos en la caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Archivos cacheados correctamente');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Evento Activate: Limpia cachés antiguas si cambia la versión
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Evento Fetch: Responde desde la caché si está disponible o busca en la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});