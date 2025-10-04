'use client'

export async function isValidVerbByAPI(verb: string) {
  try {
    const response = await fetch(`/api/isValidVerb?verb=${verb}`);
    const res = await response.json()
    // console.log("isvalidverb response no cliente:", res)
    if (response.ok) {
      return res; // seja da API ou do SW com fallback
    }
  } catch {
    // rede e SW falharam completamente 
    return { originalVerb: null, variationVerb: null };
  }
  // fallback total (sem SW ou sem cache)
  return { originalVerb: null, variationVerb: null };
}