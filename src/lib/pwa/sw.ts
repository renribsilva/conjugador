import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig, StrategyHandler } from "serwist";
import { NetworkFirst, Serwist, Strategy } from "serwist";

const CACHE_CONJ = "conj-cache";
const CACHE_ALLVERBS = "verbs-cache";

class NetworkOrFallback extends Strategy {
  async _handle(request: Request, handler: StrategyHandler) {
    const response = await handler.fetch(request);
    return response;
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
        const networkResponse = await fetch(event.request);
        return networkResponse;
      })()
    );
  }

  if (url.includes("/api/postReqVerb")) {
    event.respondWith(
      (async () => {
        const response = await fetch(event.request);
        return response; // Response válido
      })()
    );
  }
});

const JSON_URLS = [
  { url: "/json/allVerbs.json", cacheName: CACHE_ALLVERBS, type: "ALLVERBS_UPDATED" },
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        for (const json of JSON_URLS) {
          const cache = await caches.open(json.cacheName);
          const keys = await cache.keys();
          // se existir key diferente da atual -> remove
          for (const req of keys) {
            if (req.url !== new URL(json.url, self.location.origin).href) {
              await cache.delete(req);
              console.log("🗑️ Removida key antiga:", req.url, "de", json.cacheName);
            }
          }
          const response = await fetch(json.url, { cache: "no-store" });
          await cache.put(json.url, response.clone());
        }
        self.skipWaiting(); // ativa SW imediatamente
      } catch (err) {
        console.warn("⚠️ Erro ao pré-cachear JSONs:", err);
      }
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          const isValid =
            cacheName === "pages" ||
            cacheName === "serwist-precache-v2-http://localhost:3000/" ||
            cacheName === "conj-cache" ||
            cacheName === "verbs-cache" ||
            cacheName === "rules-cache"
          if (!isValid) {
            console.log("🗑️ Deletando cache inútil:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});