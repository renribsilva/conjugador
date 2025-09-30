export async function isValidVerbByAPI(verb: string) {
  try {
    console.log("1")
    const response = await fetch(`/api/isValidVerb?verb=${verb}`);
    console.log("2")
    if (response.ok) {
      console.log("2")
      return await response.json();
    } else {
      console.log("2")
      return ({ originalVerb: null, variationVerb: null });
    }
  } catch (error) {
    return ({ originalVerb: null, variationVerb: null })
  }
}