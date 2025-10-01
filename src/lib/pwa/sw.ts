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

  event.waitUntil(
    caches.open(CACHE_ALLVERBS).then(async (cache) => {
      try {
        const response = await fetch("/allVerbs.json", { cache: "no-store" })
        const allClients = await self.clients.matchAll();
        const formattedDate = getFormattedDate();
        for (const client of allClients) {
          client.postMessage({ type: "ALLVERBS_UPDATED", date: formattedDate });
        }
        return await cache.put(event.request, response.clone());
      } catch (err) {
        console.warn("Não gravou allVerbsJson no cache");
      }
    }
  ))

  event.waitUntil(
    caches.open(CACHE_RULES).then(async (cache) => {
      try {
        const response = await fetch("/rulesByTerm.json", { cache: "no-store" });
        const allClients = await self.clients.matchAll();
        const formattedDate = getFormattedDate();
        for (const client of allClients) {
          client.postMessage({ type: "RULES_UPDATED", date: formattedDate });
        }
        return await cache.put("/rulesByTerm.json", response.clone());
      } catch {
        console.warn("Não gravou rulesJson no cache");
      }
    })
  );

});

const getFormattedDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};