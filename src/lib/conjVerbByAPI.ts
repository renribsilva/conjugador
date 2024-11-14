import { conjugateVerb } from './conjugateVerb';
import { ni } from './normalizeVerb';

export const conjVerbByAPI = async (verb: string) => {
  // Chama a função de conjugação
  const conjugations = conjugateVerb(ni(verb));

  try {
    // console.log('Enviando verbo e conjugações para a API:', { verb, conjugations });

    const response = await fetch('/api/conjVerb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verb, conjugations }), // Envie o verbo e suas conjugações
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta da API:', errorData);
      throw new Error(`Erro ${response.status}: ao escrever o arquivo file.json em writeConjVerbByAPI`);
    }

    const data = await response.json();
    console.log('Resposta da API:', data.message); // Exibe a mensagem de sucesso
  } catch (error) {
    console.error('writeConjVerbByAPI failed:', error, 'verb:', verb, 'conjugations:', conjugations);
  }
};
