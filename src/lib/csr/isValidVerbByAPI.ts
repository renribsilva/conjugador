'use client'

import { processVerb } from "../ssr/isValidVerbProcess";

export async function isValidVerbByAPI(verb: string) {
  try {
    const response = await fetch(`/api/isValidVerb?verb=${verb}`);
    if (response.ok) return await response.json();
  } catch {
    // offline: tenta validar localmente
    const cache = await caches.open("verbs-cache");
    const cachedAllVerbs = await cache.match("/json/allVerbs.json");
    if (cachedAllVerbs) {
      const allVerbsJson = await cachedAllVerbs.json();
      return processVerb(verb, allVerbsJson);
    }
  }
  return { originalVerb: null, variationVerb: null };
}
