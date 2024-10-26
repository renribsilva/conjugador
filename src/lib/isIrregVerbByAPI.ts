interface IsIrregVerbResponse {
  results: boolean;
  isIrreg: boolean;
  hasRules: boolean;
}

export const isIrregVerbByAPI = async (inputValue: string): Promise<IsIrregVerbResponse> => {
  const response = await fetch(`/api/isIrregVerb?inputValue=${encodeURIComponent(inputValue)}`);

  if (!response.ok) {
    const errorMessage = `Erro ao buscar verbo: ${response.status} ${response.statusText}`;
    console.error(errorMessage); // Log de erro
    throw new Error(errorMessage);
  }

  const resultado = await response.json();
  if (resultado.isIrreg && !resultado.hasRUles) {
    console.log(`O verbo '${inputValue}' consta na lista de verbos irregulares (${resultado.isIrreg}), mas ainda não possui regras próprias de conjugação (${resultado.hasRUles})`);
  } else if (resultado.isIrreg && resultado.hasRUles) {
    console.log(`O verbo '${inputValue}' consta na lista de verbos irregulares (${resultado.isIrreg}) e já possui regras de conjugação (${resultado.hasRUles})`);
  } else {
    console.log(`O verbo '${inputValue}' não consta na lista de verbos irregulares (${resultado.isIrreg}) e, portanto, será conjugado como verbo regular`);
  }
  return resultado; // Retorna um objeto
};
