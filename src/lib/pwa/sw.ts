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

  if (url.includes("/api/postReqVerb")) {
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
});

const JSON_URLS = [
  { url: "/json/allVerbs.json", cacheName: CACHE_ALLVERBS, type: "ALLVERBS_UPDATED" },
  { url: "/json/rulesByTerm.json", cacheName: CACHE_RULES, type: "RULES_UPDATED" },
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        for (const json of JSON_URLS) {
          const cache = await caches.open(json.cacheName);
          const response = await fetch(json.url, { cache: "no-store" });
          await cache.put(json.url, response.clone());
        }
        self.skipWaiting(); // ativa SW imediatamente
      } catch (err) {
        console.warn("Erro ao pré-cachear JSONs:", err);
      }
    })()
  );
});