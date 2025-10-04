'use client'

export const conjVerbByAPI = async (verb: string) => {
  try {
    const response = await fetch(`/api/conjVerb?verb=${verb}`);
    const res = await response.json()
    // console.log("conjVerb response no cliente:", res)
    if (response.ok) {
      return res
    } else {
      // Resposta com erro, mas sem exceção (ex: 400, 500)
      return {
        model: null,
        only_reflexive: null,
        multiple_conj: null,
        canonical1: null,
        canonical2: null
      };
    }
  } catch (error) {
    // Erro na rede ou fetch falhou
    // Poderia tentar fallback local aqui, se quiser
    return {
      model: null,
      only_reflexive: null,
      multiple_conj: null,
      canonical1: null,
      canonical2: null
    };
  }
}
