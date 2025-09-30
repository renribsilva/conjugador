'use client'

import { pattern } from "./certainObjects";

export const conjVerbByAPI = async (verb: string) => {
  try {
    const response = await fetch('/api/conjVerb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verb })
    });
    if (response.ok) {
      const data = await response.json();
      return data
    } else {
      return ({ conjugations: null, propOfVerb: pattern });
    }
  } catch {
    return ({ conjugations: null, propOfVerb: pattern });
  }
};