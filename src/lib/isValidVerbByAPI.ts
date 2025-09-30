export async function isValidVerbByAPI(verb: string) {
  try {
    const response = await fetch(`/api/isValidVerb?verb=${verb}`);
    if (response.ok) {
      return await response.json();
    } else {
      return ({ originalVerb: null, variationVerb: null });
    }
  } catch (error) {
    return ({ originalVerb: null, variationVerb: null })
  }
}