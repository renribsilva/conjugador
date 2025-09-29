import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        sendStatusToClients(true);
        return response;
      })
      .catch(() => {
        sendStatusToClients(false);
        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});

self.addEventListener("fetch", (event) => {

  if(event.request.url.includes("isValidVerb")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          sendStatusToClients(true);
          if(response.ok) {
            caches.open("my-cache").then((cache) => {
              cache.put(event.request, response.clone());
            })
          }
          return response
        })
        .catch(() => {
          sendStatusToClients(false);
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              return new Response("API não acessível")
            })
        })
    );
  }
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