
const CACHE_NAME = 'cafe-app-v3';

const ASSETS_TO_CACHE = [

    './index.html',
    './manifest.json',
    './css/style.css',
    './js/app.js',
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


// Instalar el Service Worker y guardar los archivos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                for (const asset of ASSETS_TO_CACHE) {
                    try {
                        const response = await fetch(asset);

                        if (!response.ok) {
                            console.error(
                                'Error al cargar:',
                                asset,
                                'Estado:',
                                response.status
                            );

                            throw new Error('No se pudo cargar: ' + asset);
                        }

                        await cache.put(asset, response);

                        console.log('Guardado correctamente:', asset);

                    } catch (error) {
                        console.error('Falló este archivo:', asset, error);
                        throw error;
                    }
                }
            })
            .then(() => self.skipWaiting())
    );
});
// Activar el Service Worker y eliminar cachés antiguas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith('cafe-app-') &&
                                   cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// Atender las peticiones de la aplicación
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Solo procesar peticiones GET
    if (request.method !== 'GET') {
        return;
    }

    // No interceptar peticiones que no sean HTTP o HTTPS
    if (!request.url.startsWith('http')) {
        return;
    }

    // Para las páginas HTML, buscar primero en caché
    if (request.mode === 'navigate') {
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(request)
                        .then((networkResponse) => {
                            if (networkResponse.ok) {
                                const responseCopy = networkResponse.clone();

                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(request, responseCopy);
                                    });
                            }

                            return networkResponse;
                        })
                        .catch(() => {
                            return caches.match('./index.html');
                        });
                })
        );

        return;
    }

    // Para CSS, JavaScript, imágenes y otros archivos
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse.ok) {
                            const responseCopy = networkResponse.clone();

                            return caches.open(CACHE_NAME)
                                .then((cache) => {
                                    return cache.put(request, responseCopy)
                                        .then(() => networkResponse);
                                });
                        }

                        return networkResponse;
                    });
            })
            .catch(() => {
                return new Response(
                    'No hay conexión y este archivo no está guardado.',
                    {
                        status: 503,
                        statusText: 'Sin conexión',
                        headers: {
                            'Content-Type': 'text/plain; charset=utf-8'
                        }
                    }
                );
            })
    );
});

