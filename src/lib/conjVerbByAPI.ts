'use client'

import { pattern } from "./certainObjects";
import { conjugateVerb } from "./conjugateVerb";

export const conjVerbByAPI = async (verb: string) => {
  try {
    const response = await fetch('/api/conjVerb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verb })
    });
    if (response.ok) return await response.json();
  } catch {
    // offline: tenta validar localmente
    const verbsCache = await caches.open("verbs-cache");
    const rulesCache = await caches.open("rules-cache");
    const cachedVerbs = await verbsCache.match(new Request(location.origin + "/api/allVerbs"));
    const cachedRules = await rulesCache.match(new Request(location.origin + "/api/rules"));
    if (cachedVerbs && cachedRules) {
      const allVerbsJson = await cachedVerbs.json();
      const rulesJson = await cachedRules.json();
      return conjugateVerb(verb, rulesJson, allVerbsJson);
    }  
  }
  return ({ conjugations: null, propOfVerb: pattern });
};