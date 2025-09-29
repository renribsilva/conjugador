import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

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
  runtimeCaching: defaultCache, // tudo exceto /api/checkConnection
});

serwist.addEventListeners();

// Intercepta todas as requisições
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (url.includes("/api/isValidVerb")) return;

  // Intercepta /api/checkConnection **antes do defaultCache**
  if (url.includes("/api/checkConnection")) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request);
          sendStatusToClients(true);
          return response;
        } catch {
          sendStatusToClients(false);
          return new Response(
            JSON.stringify({ ok: false }),
            { headers: { "Content-Type": "application/json" }, status: 503 }
          );
        }
      })()
    );
    return;
  }

  // todas as outras requisições ficam com defaultCache
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
