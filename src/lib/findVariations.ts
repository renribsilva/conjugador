import allVerbs from '../../public/json/allVerbs.json';
import afixos from '../../public/json/afixos.json';
import { ni, nw } from './normalizeVerb';
import tryVariations from './findVariationsUtils';

type ValidPrefixResult = {
  hasVariations: boolean;
  forcedVerb: boolean;
  processedInput: string | null;
  originalInput: string | null;
  prefixFounded: boolean;
  matchingAfixo: string | null;
  conector: string | null;
  status: string;
};

const cache = new Map<string, ValidPrefixResult>();
const allVerbsSet = new Set(Object.keys(allVerbs));
const normalizedVerbs = new Set(Object.keys(allVerbs).map((v) => ni(v) || ''));
const normalizedAfixos = afixos.map(nw);

export default function findVariations(input: string): ValidPrefixResult {
  if (cache.has(input)) {
    return cache.get(input)!;
  }

  const originalInput = nw(input);
  let verb: string = ni(input.replace(/-/g, '')) || ni(input);

  const sortedAfixos = normalizedAfixos
    .slice()
    .sort((a, b) => b.length - a.length);

  const matchingAfixos = sortedAfixos.filter((afixo) => verb.startsWith(afixo));

  if (matchingAfixos.length === 0) { //lançar, caçar
    if (allVerbsSet.has(verb)) {
      const result = {
        hasVariations: false,
        forcedVerb: false,
        processedInput: verb,
        originalInput,
        prefixFounded: false,
        matchingAfixo: null,
        conector: null,
        status: "1: PREFIX = NO, FORCED = NO",
      };
      cache.set(input, result);
      return result;
    }

    const variation = tryVariations(verb, 0, normalizedVerbs);

    if (variation && allVerbsSet.has(variation)) { // lancar, cacar
      const result = {
        hasVariations: true,
        forcedVerb: true,
        processedInput: variation,
        originalInput,
        prefixFounded: false,
        matchingAfixo: null,
        conector: null,
        status: "2: PREFIX = NO, FORCED = YES",
      };
      cache.set(input, result);
      return result;
    }
  }

  if (matchingAfixos.length > 0) {

    for (const matchingAfixo of matchingAfixos) {

      let restOfVerb = verb.slice(matchingAfixo.length);
      let conector: string | null = null;
      let variation: string | null = null

      if (allVerbsSet.has(restOfVerb)) { //relançar, recomeçar
        const result = {
          hasVariations: true,
          forcedVerb: false,
          processedInput: restOfVerb,
          originalInput,
          prefixFounded: true,
          matchingAfixo,
          conector,
          status: "3: PREFIX = YES, FORCED = NO",
        };
        cache.set(input, result);
        return result;
      }

      variation = tryVariations(restOfVerb, 0, normalizedVerbs);

      if (variation && allVerbsSet.has(variation)) { //relancar, recomecar
        const result = {
          hasVariations: true,
          forcedVerb: true,
          processedInput: variation,
          originalInput,
          prefixFounded: true,
          matchingAfixo,
          conector,
          status: "4: PREFIX = YES, FORCED = YES",
        };
        cache.set(input, result);
        return result;
      }

      let restOfVerbTest
      // console.log(restOfVerb)

      if (/^([rs])\1/.test(restOfVerb)) { //ressaber
        conector = restOfVerb[0];
        restOfVerbTest = restOfVerb.slice(1);
        variation = tryVariations(restOfVerbTest, 0, normalizedVerbs);
        // console.log(variation)
        if (allVerbsSet.has(restOfVerbTest) || (variation && allVerbsSet.has(variation))) {
          restOfVerb = restOfVerbTest
        }
        // console.log(1)
      } else if (/^m[pb]/.test(restOfVerb)) { //comprazer
        conector = 'm';
        restOfVerbTest = restOfVerb.slice(1);
        variation = tryVariations(restOfVerbTest, 0, normalizedVerbs);
        if (allVerbsSet.has(restOfVerbTest) || (variation && allVerbsSet.has(variation))) {
          restOfVerb = restOfVerbTest
        }
        // console.log(3)
      } else if (/^x[aeiouáéíóúãõâêîôû]/.test(restOfVerb)) { //enxaguar
        conector = 'x';
        restOfVerbTest = restOfVerb.slice(1);
        variation = tryVariations(restOfVerbTest, 0, normalizedVerbs);
        if (allVerbsSet.has(restOfVerbTest) || (variation && allVerbsSet.has(variation))) {
          restOfVerb = restOfVerbTest
        }
        // console.log(4)
      } else if (/[aeiou]$/.test(matchingAfixo) && /^[bcdfghjklmnpqrstvwxyz]/.test(restOfVerb)) { //sobrexceler
        const vogalFinal = matchingAfixo.slice(-1); 
        restOfVerbTest = vogalFinal + restOfVerb; 
        variation = tryVariations(restOfVerbTest, 0, normalizedVerbs);
        if ((allVerbsSet.has(restOfVerbTest) && restOfVerbTest !== verb) || 
            (variation && allVerbsSet.has(variation) && restOfVerbTest !== verb)) {
          restOfVerb = restOfVerbTest
        }
        // console.log(5)
        // console.log(restOfVerbTest)
      }

      // console.log(restOfVerb)

      if (allVerbsSet.has(restOfVerb)) { //ressaber, arregaçar, comprazer
        const result = {
          hasVariations: true,
          forcedVerb: false,
          processedInput: restOfVerb,
          originalInput,
          prefixFounded: true,
          matchingAfixo,
          conector,
          status: "5: PREFIX = YES, FORCED = NO",
        };
        cache.set(input, result);
        return result;
      }

      variation = tryVariations(restOfVerb, 0, normalizedVerbs);

      if (variation && allVerbsSet.has(variation)) { // arregacar
        const result = {
          hasVariations: true,
          forcedVerb: true,
          processedInput: variation,
          originalInput,
          prefixFounded: true,
          matchingAfixo,
          conector,
          status: "6: PREFIX = YES, FORCED = YES",
        };
        cache.set(input, result);
        return result;
      }
    }
  }

  if (allVerbsSet.has(verb)) { //amar, atrasar
    const result = {
      hasVariations: false,
      forcedVerb: false,
      processedInput: verb,
      originalInput,
      prefixFounded: false,
      matchingAfixo: null,
      conector: null,
      status: "7: PREFIX = NO, FORCED = NO",
    };
    cache.set(input, result);
    return result;
  }

  const variation = tryVariations(verb, 0, normalizedVerbs);
  
  if (variation) {
    const result = {
      hasVariations: true,
      forcedVerb: true,
      processedInput: variation,
      originalInput,
      prefixFounded: false,
      matchingAfixo: null,
      conector: null,
      status: "8: PREFIX = NO, VARIATION = YES",
    };
    cache.set(input, result);
    return result;
  }

  // Valor padrão caso nenhuma condição acima seja satisfeita
  const defaultResult: ValidPrefixResult = {
    hasVariations: false,
    forcedVerb: false,
    processedInput: null,
    originalInput: null,
    prefixFounded: false,
    matchingAfixo: null,
    conector: null,
    status: "DEFAULT CASE",
  };
  cache.set(input, defaultResult);
  return defaultResult;
}
