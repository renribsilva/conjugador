import { pattern } from "./certainObjects";

export const conjVerbByAPI = async (verb: string) => {
  try {
    const response = await fetch('/api/conjVerb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verb })
    });
    if (response.ok) {
      return await response.json();
    } else {
      return ({ conjugations: null, propOfVerb: pattern });
    }
  } catch {
    return ({ conjugations: null, propOfVerb: pattern });
  }
};