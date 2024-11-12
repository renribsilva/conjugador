export async function isIrregVerbByAPI(verb: string) {
  try {
    const response = await fetch(`/api/isIrregVerb?verb=${verb}`);
    if (!response.ok) throw new Error((await response.json()).error);
    return (await response.json()).result;
  } catch (error) {
    throw new Error('isIrregVerbByAPI failed: ' + error.message);
  }
}
