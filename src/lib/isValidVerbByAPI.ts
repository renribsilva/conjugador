export async function isValidVerbByAPI(verb: string) {
  try {
    const response = await fetch(`/api/isValidVerb?verb=${verb}`);
    if (!response.ok) throw new Error((await response.json()).error);
    return (await response.json());
  } catch (error) {
    throw new Error('isValidVerbByAPI failed: ' + error.message);
  }
}
