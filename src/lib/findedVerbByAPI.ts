export async function findedVerbByAPI(verb: string) {
  try {
    const response = await fetch(`/api/findedVerb?verb=${verb}`);
    if (response.ok) {
      const data = await response.json();
      return data.result; // Retorna o resultado encontrado
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error); // Lança um erro com a mensagem retornada
    }
  } catch (error) {
    throw new Error('findedVerbByAPI failed: ' + error.message);
  }
}
