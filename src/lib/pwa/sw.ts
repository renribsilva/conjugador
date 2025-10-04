import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig, StrategyHandler } from "serwist";
import { NetworkFirst, Serwist, Strategy } from "serwist";
import { processVerb } from "../ssr/isValidVerbProcess";
import { conjugateVerb } from "../ssr/conjugateVerb";
import { getSimilarVerbs } from "../ssr/getSimilarWords";

const CACHE_ALLVERBS = "verbs-cache";

class NetworkOrFallback extends Strategy {
  async _handle(request: Request, handler: StrategyHandler) {
    try {
      // console.log("isvalidverb tentou rede")
      const response = await handler.fetch(request);
      return response;
    } catch (err) {
      // console.log("isvalidverb não encontrou rede e tentou cache")
      const cache = await caches.open("verbs-cache");
      const fallback = await cache.match("/api/allVerbs");
      if (fallback) {
        const json = await fallback.json();
        const url = new URL(request.url);
        const verb = url.searchParams.get("verb");
        if (!verb) return new Response(JSON.stringify({ originalVerb: null, variationVerb: null }))
        const result = await processVerb(verb, json);
        // console.log("isvalidverb no fallback do sw:", JSON.stringify(result))
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        });
      }

      return new Response(JSON.stringify({ originalVerb: null, variationVerb: null }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
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
      handler: new NetworkFirst(),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/similarWords"),
      handler: new NetworkFirst(),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/allVerbs"),
        handler: new NetworkFirst({
        cacheName: CACHE_ALLVERBS,
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
          // console.log("conjVerb tentou rede")
          const response = await fetch(event.request);
          return response;
        } catch (err) {
          // console.log("conjVerb não encontrou rede e tentou cache")
          const cache = await caches.open("verbs-cache");
          const fallback = await cache.match("/api/allVerbs");
          if (fallback) {
            const json = await fallback.json();
            const url = new URL(event.request.url);
            const verb = url.searchParams.get("verb");
            if (!verb) {
              return new Response(JSON.stringify({
                model: null,
                only_reflexive: null,
                multiple_conj: null,
                canonical1: null,
                canonical2: null
              }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            const result = await conjugateVerb(verb, json);
            // console.log("conjVerbs no fallback do sw:", JSON.stringify(result))
            return new Response(JSON.stringify(result), {
              headers: { 'Content-Type': 'application/json' },
              status: 200
            });
          }

          // Falha total: sem rede e sem cache
          return new Response(JSON.stringify({
            model: null,
            only_reflexive: null,
            multiple_conj: null,
            canonical1: null,
            canonical2: null
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })()
    );
  }

  if (url.includes("/api/similarWords")) {
    event.respondWith(
      (async () => {
        try {
          // console.log("similarWords tentou rede")
          const response = await fetch(event.request);
          return response;
        } catch (err) {
          // console.log("similarWords não encontrou rede e tentou cache")
          const cache = await caches.open("verbs-cache");
          const fallback = await cache.match("/api/allVerbs");
          if (fallback) {
            const json = await fallback.json();
            const url = new URL(event.request.url);
            const verb = url.searchParams.get("verb");
            if (!verb) {
              return new Response(JSON.stringify(null), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            const result = await getSimilarVerbs(verb, json);
            // console.log("similarWords no fallback do sw:", JSON.stringify(result))
            return new Response(JSON.stringify(result), {
              headers: { 'Content-Type': 'application/json' },
              status: 200
            });
          }

          // Falha total: sem rede e sem cache
          return new Response(JSON.stringify(null), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })()
    );
  }

  if (url.includes("/api/postReqVerb")) {
    event.respondWith(
      (async () => {
        const response = await fetch(event.request);
        return response;
      })()
    );
  }
});

const JSON_URLS = [
  { url: "/api/allVerbs", cacheName: CACHE_ALLVERBS, type: "ALLVERBS_UPDATED" },
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        await Promise.all(JSON_URLS.map(async (json) => {
          try {
            const cache = await caches.open(json.cacheName);
            const keys = await cache.keys();
            for (const req of keys) {
              if (req.url !== new URL(json.url, self.location.origin).href) {
                await cache.delete(req);
              }
            }
            const response = await fetch(json.url, { cache: "no-store" });
            if (!response.ok) throw new Error(`Erro: ${response.status}`);
            await cache.put(json.url, response.clone());
            // console.log("dados inseridos em verbs-cache:", await response.json())
          } catch (error) {
            console.warn(`Falha ao pré-cachear ${json.url}:`, error);
          }
        }));
        self.skipWaiting(); // ativa SW imediatamente
      } catch (err) {
        console.warn("⚠️ Erro ao pré-cachear JSONs:", err);
      }
    })()
  );
});