'use server'

import { ni } from './normalizeVerb';
import { 
  extractPunctuation, 
  findOriginalVerb, 
  findSimilarWords, 
  getNormalizedJsonKeys, 
} from './isValidVerbUtils';
import findVariations from './findVariations';

export async function processVerb (verb: string, allVerbJson: object) {

  const normalizedVerb = ni(verb);
  const { punct } = extractPunctuation(normalizedVerb);

  let cleanedVerb = normalizedVerb;
  
  if (punct) {
    const regex = new RegExp(`[${punct.join('')}]`, 'g');
    cleanedVerb = cleanedVerb.replace(regex, '');
  }

  if (!allVerbJson) {
    throw new Error('Failed to load JSON data.');
  }

  const normalizedallVerbJson = getNormalizedJsonKeys(allVerbJson);
  const originalVerb = findOriginalVerb(normalizedallVerbJson, cleanedVerb);
  const variations = findVariations(cleanedVerb);
  // console.log(variations)

  if (originalVerb && originalVerb in normalizedallVerbJson) {

    const similarWords = findSimilarWords(normalizedallVerbJson, cleanedVerb);
    const originalValue = allVerbJson[originalVerb];
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
    
    const similarWords = findSimilarWords(normalizedallVerbJson, variations.processedInput);
    const originalValue = allVerbJson[variations.processedInput];
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

// processVerb("reabracar.,")