'use client'

import { pattern } from "../ssr/certainObjects";
import { conjugateVerb } from "../ssr/conjugateVerb";

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
    const cachedVerbs = await verbsCache.match("/json/allVerbs.json");
    if (cachedVerbs) {
      const allVerbsJson = await cachedVerbs.json();
      return conjugateVerb(verb, allVerbsJson);
    }  
  }
  return ({ conjugations: null, propOfVerb: pattern });
};