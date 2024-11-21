import allVerbs from '../json/allVerbs.json';
import afixos from '../json/afixos.json';
import { ni, nw } from './normalizeVerb';

type ValidPrefixResult = {
  isValid: boolean;
  afixo: string | null;
  conector: string | null;
  originalInput: string; 
};

const cache = new Map<string, ValidPrefixResult>();
const allVerbsSet = new Set(Object.keys(allVerbs)); // Melhor desempenho
const normalizedVerbs = new Set(Object.keys(allVerbs).map(ni)); // Pré-normalização
const normalizedAfixos = afixos.map(nw); // Pré-normalização

export default function isValidPrefix(input: string): ValidPrefixResult {
  if (cache.has(input)) {
    return cache.get(input)!;
  }

  function tryVariations(verb: string, index: number): string | null {
    if (index >= verb.length) return null;

    const foundKey = Array.from(normalizedVerbs).find((key) => ni(key) === verb); // Busca eficiente
    if (foundKey) return foundKey;

    if (verb[index] === 'c') {
      const modifiedVerb = verb.slice(0, index) + 'ç' + verb.slice(index + 1);
      const result = tryVariations(modifiedVerb, index + 1);
      if (result) return result;
    } else if (verb[index] === 'ç') {
      const modifiedVerb = verb.slice(0, index) + 'c' + verb.slice(index + 1);
      const result = tryVariations(modifiedVerb, index + 1);
      if (result) return result;
    }

    return tryVariations(verb, index + 1);
  }

  let verb: string | null = input.replace(/-/g, '');
  const originalInput = input;

  const sortedAfixos = normalizedAfixos
    .slice()
    .sort((a, b) => b.length - a.length);

  for (const afixo of sortedAfixos) {
    if (verb?.startsWith(afixo)) {
      let restOfVerb = verb.slice(afixo.length);
      let conector: string | null = null;

      if (/^([rs])\1/.test(restOfVerb)) {
        conector = restOfVerb[0];
        restOfVerb = restOfVerb.slice(1);
      } else if (/^n[cdfghjklmnqrstvwxyz]/.test(restOfVerb)) {
        conector = 'n';
        restOfVerb = restOfVerb.slice(1);
      } else if (/^m[pb]/.test(restOfVerb)) {
        conector = 'm';
        restOfVerb = restOfVerb.slice(1);
      }

      verb = restOfVerb;

      if (allVerbsSet.has(ni(verb))) {
        const result = { isValid: true, afixo, conector, originalInput };
        cache.set(input, result);
        return result;
      }

      verb = tryVariations(verb, 0);

      if (verb && allVerbsSet.has(ni(verb))) {
        const result = { isValid: true, afixo, conector, originalInput };
        cache.set(input, result);
        return result;
      }
    }
  }

  const result = { isValid: false, afixo: null, conector: null, originalInput };
  cache.set(input, result);
  return result;
}
