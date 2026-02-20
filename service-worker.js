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

  if (request.method !== 'GET') {
    return;
  }

  if (isLocalImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  event.respondWith(handleAssetRequest(request));
});

async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match('./index.html');
  }
}

async function handleAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (networkResponse && networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

async function handleImageRequest(request) {
  const cache = await caches.open(IMAGES_CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      await trimImageCache(cache, MAX_IMAGE_ENTRIES);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

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
