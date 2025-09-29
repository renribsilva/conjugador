import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkFirst, Serwist } from "serwist";

const CACHE_CHECK = "check-cache";
const CACHE_VERB = "verb-cache";
const CACHE_CONJ = "conj-cache";
const CACHE_QUERY = "query-cache";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/checkConnection"),
      handler: new NetworkFirst({
        cacheName: CACHE_CHECK,
      }),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/isValidVerb"),
      handler: new NetworkFirst({
        cacheName: CACHE_VERB,
      }),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/conjVerb"),
      handler: new NetworkFirst({
        cacheName: CACHE_CONJ,
      }),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/queryVerb"),
      handler: new NetworkFirst({
        cacheName: CACHE_QUERY,
      }),
    },
    ...defaultCache
  ],
});

serwist.addEventListeners();

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  //Intercepta /api/conjVerb
  if (url.includes("/api/conjVerb")) {
    event.respondWith(
      (async () => {
        try {          
          const networkResponse = await fetch(event.request);
          const cache = await caches.open(CACHE_CONJ);
          const fallback = new Response(
            JSON.stringify(null),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
          await cache.put(event.request, fallback);
          return networkResponse;
        } catch {
          // Falha na rede -> retorna do cache
          const cache = await caches.open(CACHE_CONJ);
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) return cachedResponse;
          return new Response(
            JSON.stringify(null),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
      })()
    );
  }

  // Intercepta /api/isValidVerb
  if (url.includes("/api/isValidVerb")) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          const cache = await caches.open(CACHE_VERB);
          const fallback = new Response(
            JSON.stringify({ originalVerb: null, variationVerb: null }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
          await cache.put(event.request, fallback);
          return networkResponse;
        } catch {
          const cache = await caches.open(CACHE_VERB);
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) return cachedResponse;
          return new Response(
            JSON.stringify({ originalVerb: null, variationVerb: null }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
      })()
    );
    return;
  }

  if (url.includes("/api/queryVerb")) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          const cache = await caches.open(CACHE_QUERY);
          const fallback = new Response(
            JSON.stringify(null),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
          await cache.put(event.request, fallback);
          return networkResponse;
        } catch {
          const cache = await caches.open(CACHE_QUERY);
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) return cachedResponse;
          return new Response(
            JSON.stringify(null),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
      })()
    );
    return;
  }

  // Intercepta /api/checkConnection
  if (url.includes("/api/checkConnection")) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          const cache = await caches.open(CACHE_CHECK);
          const fallback = new Response(JSON.stringify({ ok: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
          await cache.put(event.request, fallback);
          return networkResponse;
        } catch {
          const cache = await caches.open(CACHE_CHECK);
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) return cachedResponse;
          return new Response(JSON.stringify({ ok: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      })()
    );
  }
});
