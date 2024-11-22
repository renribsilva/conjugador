import isValidPrefix from "./isValidPrefix";
import { ni } from "./normalizeVerb";

type VerbResult = {
  forcedVerb: string;
  originalInput: string;
  isForced: boolean;
  validPrefix: boolean
};

export default function findOriginalVerbFormatted (
  jsonObject: Record<string, any>,
  normalizedVerb: string
): VerbResult {

  const verb: string = normalizedVerb;
  let isForced: boolean = false;

  function tryVariations(verb: string, index: number): string | null {
    if (index >= verb.length) return null;

    const foundKey = Object.keys(jsonObject).find((key) => ni(key) === verb);
    if (foundKey) {
      isForced = false
      return foundKey
    };

    if (verb[index] === 'c') {
      const modifiedVerb = verb.slice(0, index) + 'ç' + verb.slice(index + 1);
      const result = tryVariations(modifiedVerb, index + 1);
      if (result) {
        isForced = true
        return result
      };
    } else if (verb[index] === 'ç') {
      const modifiedVerb = verb.slice(0, index) + 'c' + verb.slice(index + 1);
      const result = tryVariations(modifiedVerb, index + 1);
      if (result) {
        isForced = true
        return result
      };
    }

    return tryVariations(verb, index + 1);
  }

  const prefix = isValidPrefix(verb);
  let afixo = '';
  let conector = '';
  let validPrefix = false

  const originalInput = prefix.originalInput;

  if (prefix.isValid && prefix.afixo) afixo = prefix.afixo;
  if (prefix.isValid && prefix.conector) conector = prefix.conector;

  let forcedVerb = verb;

  if (!prefix.isValid) {

    const resultWithoutPrefix = tryVariations(normalizedVerb, 0);
    if (resultWithoutPrefix) {
      forcedVerb = resultWithoutPrefix;
      validPrefix = false
    }
    return { forcedVerb, originalInput, isForced, validPrefix };

  } else if (prefix.isValid) {

    const normalizedWithoutPrefix = verb.replace(afixo + conector, '');
    const resultWithoutPrefix = tryVariations(normalizedWithoutPrefix, 0);
    if (resultWithoutPrefix) {
      forcedVerb = resultWithoutPrefix;
      validPrefix = true
    }
    return { forcedVerb, originalInput, isForced, validPrefix };
  }

  // Retorno padrão para evitar o erro
  return {
    forcedVerb,
    originalInput,
    isForced,
    validPrefix
  };
}

