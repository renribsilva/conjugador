'use client'

export async function isValidVerbByAPI(verb: string) {
  try {
    const response = await fetch(`/api/isValidVerb?verb=${verb}`, {
      method: 'GET',
    });
    if (response.ok) {
      const data = await response.json();
      return data
    } else {
      return ({ originalVerb: null, variationVerb: null });
    }
  } catch (error) {
    return ({ originalVerb: null, variationVerb: null })
  }
}