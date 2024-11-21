import allVerbs from '../json/allVerbs.json';
import afixos from '../json/afixos.json';
import { ni, nw } from './normalizeVerb';

type ValidPrefixResult = {
  isValid: boolean;
  afixo: string | null;
  conector: string | null;
  originalInput: string; 
};

const afixosNormalized = afixos.map(afixo => nw(afixo)).sort((a, b) => b.length - a.length);

export default function isValidPrefix(input: string): ValidPrefixResult {

  // Função para verificar as variações de um verbo (c/ç)
  function tryVariations(verb: string): string | null {
    const variations = new Set([verb]);

    // Verifica as variações c/ç de forma iterativa
    const queue = [verb];
    while (queue.length) {
      const currentVerb = queue.shift()!;
      if (Object.keys(allVerbs).includes(ni(currentVerb))) return ni(currentVerb);

      // Tentar variações c/ç
      if (currentVerb.includes('c')) {
        const modified = currentVerb.replace('c', 'ç');
        if (!variations.has(modified)) {
          variations.add(modified);
          queue.push(modified);
        }
      } else if (currentVerb.includes('ç')) {
        const modified = currentVerb.replace('ç', 'c');
        if (!variations.has(modified)) {
          variations.add(modified);
          queue.push(modified);
        }
      }
    }

    return null; // Nenhuma variação válida encontrada
  }

  let verb = input.replace(/-/g, '');
  const originalInput = input;

  // Verificar se o verbo já existe diretamente
  if (allVerbs.hasOwnProperty(verb)) {
    return { isValid: true, afixo: '', conector: null, originalInput };
  }

  // Testando os afixos
  for (const afixo of afixosNormalized) {
    if (verb.startsWith(afixo)) {
      let restOfVerb = verb.slice(afixo.length);
      let conector: string | null = null;

      // Verificação de conectores
      if (/^(rs)/.test(restOfVerb)) {
        conector = restOfVerb[0];
        restOfVerb = restOfVerb.slice(1);
      } else if (/^n[cdfghjklmnqrstvwxyz]/.test(restOfVerb)) {
        conector = 'n';
        restOfVerb = restOfVerb.slice(1);
      } else if (/^m[pb]/.test(restOfVerb)) {
        conector = 'm';
        restOfVerb = restOfVerb.slice(1);
      }

      // Verificar se o verbo é válido
      if (allVerbs.hasOwnProperty(restOfVerb)) {
        return { isValid: true, afixo, conector, originalInput };
      }

      // Verificar as variações do verbo
      const variation = tryVariations(restOfVerb);
      if (variation && allVerbs.hasOwnProperty(variation)) {
        return { isValid: true, afixo, conector, originalInput };
      }
    }
  }

  // Caso não encontre um verbo válido
  return { isValid: false, afixo: null, conector: null, originalInput };
}
