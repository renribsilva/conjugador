import { conjugateVerb } from './conjugateVerb';
import { ni } from './normalizeVerb';

export const conjVerbByAPI = async (verb: string) => {
  
  const conjugations = conjugateVerb(ni(verb));

  try {

    const response = await fetch('/api/conjVerb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verb, conjugations }), 

    });

    if (!response.ok) {

      const errorData = await response.json();
      console.error('Erro na resposta da API:', errorData);
      throw new Error(`Erro ${response.status}: ao escrever o arquivo file.json em writeConjVerbByAPI`);

    }

    const data = await response.json();
    console.log('Resposta da API:', data.message); 

  } catch (error) {

    console.error('writeConjVerbByAPI failed:', error, 'verb:', verb, 'conjugations:', conjugations);
    
  }
};