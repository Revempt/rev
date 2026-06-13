const CACHE_NAME = 'rev-cache-v3';
const IMAGES_CACHE_NAME = 'rev-images-v3';
const MAX_IMAGE_ENTRIES = 200;

const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './renderers.js',
  './data.js',
  './audio.js',
  './particles.js',
  './manifest.json',

  './imagens/assets/miniatura.png',
  './imagens/icons/icon-192.png',
  './imagens/icons/icon-512.png',
  './imagens/icons/maskable-192.png',
  './imagens/icons/maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => {
          const isOldAppCache = key.startsWith('rev-cache-') && key !== CACHE_NAME;
          const isOldImagesCache = key.startsWith('rev-images-') && key !== IMAGES_CACHE_NAME;
          return isOldAppCache || isOldImagesCache;
        })
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Só interceptamos requisições GET
  if (request.method !== 'GET') {
    return;
  }

  // Passamos o 'event' junto para podermos usar event.waitUntil e não bloquear a resposta
  if (isLocalImageRequest(request)) {
    event.respondWith(handleImageRequest(request, event));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request, event));
    return;
  }

  event.respondWith(handleAssetRequest(request, event));
});

async function handleNavigationRequest(request, event) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      // Salva no cache em segundo plano sem atrasar o retorno para a tela
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache))
      );
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match('./index.html');
  }
}

async function handleAssetRequest(request, event) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      // Salva no cache em segundo plano
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache))
      );
    }
    return networkResponse;
  } catch (error) {
    // Retorna vazio caso falhe a rede e não tenha no cache, evitando crash
    return new Response('', { status: 404, statusText: 'Not Found' });
  }
}

async function handleImageRequest(request, event) {
  const cache = await caches.open(IMAGES_CACHE_NAME);
  
  // Otimização: Cache-First para imagens. Retorna super rápido se já existir.
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      // Salva e limpa o cache em background, sem travar o carregamento da imagem
      event.waitUntil(
        (async () => {
          await cache.put(request, responseToCache);
          await trimImageCache(cache, MAX_IMAGE_ENTRIES);
        })()
      );
    }
    return networkResponse;
  } catch (error) {
    const genericCached = await caches.match(request);
    if (genericCached) return genericCached;

    return new Response('', { status: 404, statusText: 'Not Found' });
  }
}

function isLocalImageRequest(request) {
  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isImagePath =
    url.pathname.includes('/rev/imagens/') ||
    url.pathname.includes('/imagens/') ||
    url.pathname.includes('/assets/') ||
    url.pathname.includes('/icons/');
  return isSameOrigin && isImagePath;
}

async function trimImageCache(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length <= maxEntries) {
    return;
  }

  const keysToDelete = keys.slice(0, keys.length - maxEntries);
  await Promise.all(keysToDelete.map((key) => cache.delete(key)));
}