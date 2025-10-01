import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig, StrategyHandler } from "serwist";
import { NetworkFirst, Serwist, Strategy } from "serwist";

const CACHE_CONJ = "conj-cache";
const CACHE_ALLVERBS = "verbs-cache";
const CACHE_RULES = "rules-cache";

class NetworkOrFallback extends Strategy {
  async _handle(request: Request, handler: StrategyHandler) {
    try {
      const response = await handler.fetch(request);
      return response;
    } catch {
      throw new Error("Offline");
    }
  }
}

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
      matcher: ({ url }) => url.pathname.startsWith("/api/isValidVerb"),
      handler: new NetworkOrFallback(),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/allVerbs"),
      handler: new NetworkFirst({
        cacheName: CACHE_ALLVERBS,
      }),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/rules"),
      handler: new NetworkFirst({
        cacheName: CACHE_RULES,
      }),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/conjVerb"),
      handler: new NetworkFirst({
        cacheName: CACHE_CONJ,
      }),
    },
    ...defaultCache
  ],
});

serwist.addEventListeners();

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (url.includes("/api/conjVerb")) {
    event.respondWith(
      (async () => {
        try {          
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch {
          throw new Error("Offline");
        }
      })()
    );
  }

  if (url.includes("/api/allVerbs")) {
    event.respondWith(
       (async () => {
        try {
          const networkResponse = await fetch(event.request);
          const cache = await caches.open(CACHE_ALLVERBS);
          await cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch {
          const cache = await caches.open(CACHE_ALLVERBS);
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) return cachedResponse;
          return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
        }
      })()
    );
  }

  if (url.includes("/api/rules")) {
    event.respondWith(
       (async () => {
        try {
          const networkResponse = await fetch(event.request);
          const cache = await caches.open(CACHE_RULES);
          await cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch {
          const cache = await caches.open(CACHE_RULES);
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) return cachedResponse;
          return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
        }
      })()
    );
  }
});
