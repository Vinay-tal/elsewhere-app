'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // In development mode, aggressively unregister any active service worker and clear caches
    // so Turbopack dev chunks and HMR are never hijacked or served stale on mobile devices.
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      }).catch(() => {});

      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name).catch(() => {});
          }
        }).catch(() => {});
      }
      return;
    }

    // Only register Service Worker in production
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[Elsewhere SW] New content available; please refresh.');
                  } else {
                    console.log('[Elsewhere SW] Content cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('[Elsewhere SW] Registration failed:', error);
        });
    });
  }, []);

  return null;
}
