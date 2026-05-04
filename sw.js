// FILE: sw.js — Service Worker de +500 AURA
// VERSIÓN: incrementar CACHE_NAME en cada deploy con cambios de assets
// REGLA: aura-v1 → aura-v2 → aura-v3 ...

const CACHE_NAME   = 'aura-v3';
const RUNTIME_NAME = 'aura-runtime-v3';

const CACHE_ASSETS = [
  // Páginas base
  '/',
  '/index.html',
  '/login.html',
  '/app.html',

  // CSS y JS core
  '/styles.css',
  '/app.js',
  '/guardian.js',
  '/guardian-widget.js',
  '/adaptive-plan.js',

  // Libs
  '/lib/safe-exit.js',
  '/lib/session-persistence.js',
  '/lib/answer-lock.js',
  '/lib/content-quality.js',
  '/lib/plans.js',
  '/lib/score-predictor.js',
  '/lib/invite-codes.js',
  '/lib/onboarding.js',
  '/lib/exam-calendar.js',
  '/lib/battle.js',
  '/lib/certificates.js',
  '/lib/question-renderer.js',
  '/lib/audio-synth.js',
  '/lib/audio-config.js',
  '/lib/audio-engine.js',
  '/lib/audio-events.js',

  // Componentes
  '/components/bottom-nav.js',
  '/components/pwa-install.js',

  // Íconos PWA críticos
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',

  // Splash screens iOS
  '/splash/splash-390x844.png',
  '/splash/splash-375x667.png',
  '/splash/splash-414x896.png',
];

// ─── INSTALL: Pre-cachear assets críticos ────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[AURA SW] Pre-cacheando assets críticos…');
        // addAll falla silenciosamente por archivo; usamos Promise.allSettled
        return Promise.allSettled(
          CACHE_ASSETS.map(url =>
            cache.add(url).catch(err =>
              console.warn(`[AURA SW] No se pudo cachear ${url}:`, err.message)
            )
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE: Limpiar cachés viejos ─────────────────────────────────────────
self.addEventListener('activate', event => {
  const VALID = [CACHE_NAME, RUNTIME_NAME];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => !VALID.includes(k))
          .map(k => {
            console.log('[AURA SW] Eliminando caché obsoleto:', k);
            return caches.delete(k);
          })
      ))
      .then(() => self.clients.claim())
  );
});

// ─── FETCH: Estrategia de respuesta ──────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar GET; dejar pasar POST/PUT/DELETE sin tocar
  if (request.method !== 'GET') return;

  // Supabase — siempre red (realtime, auth, datos)
  if (url.hostname.includes('supabase.co')) return;

  // El propio SW nunca se cachea
  if (url.pathname === '/sw.js') return;

  // CDN externas (Tailwind, KaTeX, Supabase JS) — Cache First con fallback
  if (
    url.hostname === 'cdn.jsdelivr.net' ||
    url.hostname === 'cdn.tailwindcss.com' ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.open(RUNTIME_NAME).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(res => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Assets pre-cacheados → Cache First
  if (CACHE_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(cached => cached ?? fetch(request))
    );
    return;
  }

  // Imágenes → Cache First con timeout de 3s y fallback al ícono
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(RUNTIME_NAME).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          const net = fetch(request).then(res => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          });
          return Promise.race([
            net,
            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000)),
          ]).catch(() => caches.match('/icons/icon-192.png'));
        })
      )
    );
    return;
  }

  // Páginas HTML → Network First; si hay fallo, servir caché
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(res => {
          caches.open(RUNTIME_NAME).then(c => c.put(request, res.clone()));
          return res;
        })
        .catch(() =>
          caches.match(request).then(c => c ?? caches.match('/app.html'))
        )
    );
    return;
  }

  // Todo lo demás → Stale While Revalidate
  event.respondWith(
    caches.open(RUNTIME_NAME).then(cache =>
      cache.match(request).then(cached => {
        const net = fetch(request).then(res => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        });
        return cached ?? net;
      })
    )
  );
});

// ─── BACKGROUND SYNC: Respuestas guardadas sin conexión ──────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-answers') {
    event.waitUntil(syncPendingAnswers());
  }
});

async function syncPendingAnswers() {
  // Placeholder: en el futuro leer de IndexedDB y enviar a Supabase
  console.log('[AURA SW] Sincronizando respuestas offline…');
}

// ─── PUSH NOTIFICATIONS: Recordatorios de racha ──────────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? '⚡ +500 AURA', {
      body:    data.body ?? 'Tu Guardián te espera. No rompas la racha.',
      icon:    '/icons/icon-192.png',
      badge:   '/icons/icon-72.png',
      vibrate: [200, 100, 200],
      data:    { url: data.url ?? '/app.html' },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
