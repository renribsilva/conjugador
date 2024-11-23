import { ni } from './normalizeVerb';
import findOriginalVerbFormatted from './findOriginalVerbFormatted';
import isValidPrefix from './isValidPrefix';
import { 
  extractPunctuation, 
  findOriginalVerb, 
  findSimilarWords, 
  getNormalizedJsonKeys, 
  loadJsonObject 
} from './isValidVerbUtils';

// Função principal para processar o verbo
export async function processVerb(verb: string) {
  const normalizedVerb = ni(verb);
  const { hasPunct, punct } = extractPunctuation(normalizedVerb);

  let cleanedVerb = normalizedVerb;
  if (hasPunct && punct) {
    const regex = new RegExp(`[${punct.join('')}]`, 'g');
    cleanedVerb = cleanedVerb.replace(regex, '');
  }

  // Carregar dados JSON do arquivo ou do cache
  const jsonObject = await loadJsonObject();
  if (!jsonObject) {
    throw new Error('Failed to load JSON data.');
  }

  // Obter as chaves normalizadas do JSON
  const normalizedJsonObject = getNormalizedJsonKeys(jsonObject);

  // Procurar pelo verbo original formatado
  const formatted = findOriginalVerbFormatted(jsonObject, cleanedVerb);
  const originalVerb = findOriginalVerb(normalizedJsonObject, cleanedVerb);

  if (originalVerb) {
  
    const similarWords = findSimilarWords(normalizedJsonObject, cleanedVerb);
    const originalValue = jsonObject[originalVerb];
    const findedWord = originalValue[0];
    const hasPrefix = isValidPrefix(cleanedVerb).isValid

    return {
      result: true,
      findedWord,
      similar: similarWords.length > 0 ? [originalVerb, ...similarWords] : null,
      hasPunct,
      punct,
      hasPrefix, 
      formatted
    };

  } else if (formatted.forcedVerb && formatted.forcedVerb in normalizedJsonObject) {
    
    const similarWords = findSimilarWords(normalizedJsonObject, formatted.forcedVerb);
    const originalValue = jsonObject[formatted.forcedVerb];
    const findedWord = originalValue[0];
    const hasPrefix = isValidPrefix(formatted.forcedVerb).isValid

    return {
      result: true,
      findedWord,
      similar: similarWords.length > 0 ? [formatted.forcedVerb, ...similarWords] : null,
      hasPunct,
      punct,
      hasPrefix,
      formatted
    };
  } else {
    return {
      result: false,
      findedWord: null,
      similar: null,
      hasPunct,
      punct,
      hasPrefix: false,
      formatted
    };
  }
}