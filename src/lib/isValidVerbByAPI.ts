'use client'

import { processVerb } from "./isValidVerbProcess";

export async function isValidVerbByAPI(verb: string) {
  console.log("1")
  try {
    const response = await fetch(`/api/isValidVerb?verb=${verb}`);
    if (response.ok) return await response.json();
  } catch {
    // offline: tenta validar localmente
    const cache = await caches.open("verbs-cache");
    const cachedAllVerbs = await cache.match(new Request(location.origin + "/api/allVerbs"));
    if (cachedAllVerbs) {
      const allVerbsJson = await cachedAllVerbs.json();
      return processVerb(verb, allVerbsJson);
    }
  }
  return { originalVerb: null, variationVerb: null };
}
