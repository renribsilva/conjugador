import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig, StrategyHandler } from "serwist";
import { NetworkFirst, Serwist, Strategy } from "serwist";

const CACHE_CONJ = "conj-cache";

class NetworkOrFallback extends Strategy {
  async _handle(request: Request, handler: StrategyHandler) {
    try {
      const response = await handler.fetch(request);
      return response;
    } catch {
      return new Response(
        JSON.stringify({ originalVerb: null, variationVerb: null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
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
    // {
    //   matcher: ({ url }) => url.pathname.startsWith("/api/conjVerb"),
    //   handler: new NetworkFirst({
    //     cacheName: CACHE_CONJ,
    //   }),
    // },
    ...defaultCache
  ],
});

serwist.addEventListeners();

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // //Intercepta /api/conjVerb
  // if (url.includes("/api/conjVerb")) {
  //   event.respondWith(
  //     (async () => {
  //       try {          
  //         const networkResponse = await fetch(event.request);
  //         const cache = await caches.open(CACHE_CONJ);
  //         const fallback = new Response(
  //           JSON.stringify(null),
  //           { status: 200, headers: { "Content-Type": "application/json" } }
  //         );
  //         await cache.put(event.request, fallback);
  //         sendStatusToClients(true)
  //         return networkResponse;
  //       } catch {
  //         // Falha na rede -> retorna do cache
  //         const cache = await caches.open(CACHE_CONJ);
  //         const cachedResponse = await cache.match(event.request);
  //         sendStatusToClients(false)
  //         if (cachedResponse) return cachedResponse;
  //         return new Response(
  //           JSON.stringify(null),
  //           { status: 200, headers: { "Content-Type": "application/json" } }
  //         );
  //       }
  //     })()
  //   );
  // }
});

function sendStatusToClients(status: boolean) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "NETWORK_STATUS",
        isOnline: status,
      });
    });
  });
}
