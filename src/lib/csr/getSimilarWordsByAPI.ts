'use client'

export const getSimilarWordsByAPI = async (verb: string) => {
  try {
    const response = await fetch(`/api/similarWords?verb=${verb}`);
    const res = await response.json()
    // console.log("getSimilarWords response no cliente:", res)

    if (response.ok) {
      return res
    } else {
      // Resposta com erro, mas sem exceção (ex: 400, 500)
      return null;
    }
  } catch (error) {
    // Erro na rede ou fetch falhou
    // Poderia tentar fallback local aqui, se quiser
    return null;
  }
}
