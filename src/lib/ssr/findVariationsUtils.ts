'use server'

import { ni } from './normalizeVerb';

export default function tryVariations (

  verb: string,
  index: number,
  normalizedVerbs: Set<string>

): string | null {
  
  if (index >= verb.length) return null;

  if (verb === '') return null

  const foundKey = Array.from(normalizedVerbs).find((key) => ni(key) === verb);
  if (foundKey) return foundKey;

  if (verb[index] === 'c') {
    const modifiedVerb = verb.slice(0, index) + 'ç' + verb.slice(index + 1);
    const result = tryVariations(modifiedVerb, index + 1, normalizedVerbs);
    if (result) return result;
  } else if (verb[index] === 'ç') {
    const modifiedVerb = verb.slice(0, index) + 'c' + verb.slice(index + 1);
    const result = tryVariations(modifiedVerb, index + 1, normalizedVerbs);
    if (result) return result;
  }

  return tryVariations(verb, index + 1, normalizedVerbs);
}
