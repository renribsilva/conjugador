import { conjugateVerb } from './conjugateVerb';

export const writeConjVerbByAPI = async (verb: string) => {

  // Chama a função de conjugação
  const conjugations = conjugateVerb(verb);

  try {
    const response = await fetch('/api/conjVerb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verb, conjugations }), // Envie o verbo e suas conjugações
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ao escrever o arquivo file.json em writeConjVerbByAPI`);
    }

    const data = await response.json();
    console.log(data.message); // Exibe a mensagem de sucesso
  } catch (error) {
    console.error('writeConjVerbByAPI failed:', error);
  }
};
