import { ni } from './normalizeVerb';
import { 
  extractPunctuation, 
  findOriginalVerb, 
  findSimilarWords, 
  getNormalizedJsonKeys, 
  loadJsonObject 
} from './isValidVerbUtils';
import findVariations from './findVariations';

export async function processVerb (verb: string) {

  const normalizedVerb = ni(verb);
  const { punct } = extractPunctuation(normalizedVerb);

  let cleanedVerb = normalizedVerb;
  
  if (punct) {
    const regex = new RegExp(`[${punct.join('')}]`, 'g');
    cleanedVerb = cleanedVerb.replace(regex, '');
  }

  const jsonObject = await loadJsonObject();

  if (!jsonObject) {
    throw new Error('Failed to load JSON data.');
  }

  const normalizedJsonObject = getNormalizedJsonKeys(jsonObject);
  const originalVerb = findOriginalVerb(normalizedJsonObject, cleanedVerb);
  const variations = findVariations(cleanedVerb);

  if (originalVerb && originalVerb in normalizedJsonObject) {

    const similarWords = findSimilarWords(normalizedJsonObject, cleanedVerb);
    const originalValue = jsonObject[originalVerb];
    const findedWord = originalValue.verb[0];
    
    return {
      originalVerb: {
        result: true,
        findedWord,
        similar: similarWords.length > 0 ? [originalVerb, ...similarWords] : null,
        punct,  
        variations
      },
      variationVerb: null 
    };
  }
  
  if (variations.processedInput) {
    
    const similarWords = findSimilarWords(normalizedJsonObject, variations.processedInput);
    const originalValue = jsonObject[variations.processedInput];
    const findedWord = originalValue.verb[0];
  
    return {
      originalVerb: null,
      variationVerb: {
        result: true,
        findedWord,
        similar: similarWords.length > 0 ? [variations.processedInput, ...similarWords] : null,
        punct,  
        variations
      },
    };
  
  } else {
    return {
      originalVerb: null,
      variationVerb: null,
    };
  }  
}