import irreg from '../json/rulesForNoReg.json';
import loadAfixos from './loadAfixos';

// Função recursiva para buscar irregularidades
function innerSearch(obj: object, P: string, M: string, D: string) {
  let hasTarget = false;
  let rule: string | null = null;

  function Search(o: any) {
    if (o && typeof o === 'object') {
      if (o[D]) {
        for (const subKey in o[D]) {
          if (o[D][subKey][M]?.includes(P)) {
            hasTarget = true;
            rule = subKey;
            return;
          }
        }
      } else {
        Object.values(o).forEach(Search);
      }
    }
  }

  Search(obj);

  return {
    hasTarget,
    rule,
    P,
    M
  };
}

// Função principal para encontrar a regra de um verbo
export function findNoRegRule(verb: string, P: string, M: string, D: string) {

  const afixos = loadAfixos();
  const sortedAfixos = afixos.sort((a, b) => b.length - a.length);
  const endings = Object.keys(irreg).sort((a, b) => b.length - a.length);

  // Função para filtrar regras com base na terminação do verbo ou no próprio verbo
  function getVerbKeys(verb: string, endings: string[]): any {
    const ending = endings.find((end) => verb.endsWith(end));  
    const rules = ending ? irreg[ending] : null;
    return { ending, rules };
  }

  // Função para verificar se um verbo começa com um afixo válido
  function isValidPrefix(verb: string, sortedAfixos: string[]): boolean {
    return sortedAfixos.some((afixo) => verb.startsWith(afixo));
  }

  // Executando getVerbKeys e guardando em um objeto
  const { ending, rules: verbRules } = getVerbKeys(verb, endings);
  console.log('Regras associadas à terminação:', verbRules);

  // Caso o verbo tenha regras associadas a ele
  if (verbRules) {

    // Ignora verbos passados à função com exatamente "..."
    if (verb.startsWith("...")) {
      return {
        hasTarget: false,
        rule: null,
        P: null,
        M: null,
        ending: null,
        verb: null,
        types: null,
        abundance: null,
        note: null,
        afixo: null  // Retorna null para afixo
      };
    }

    // Caso o verbo tenha a chave exata "..."
    if (verbRules["..."]) {
      const verbRule = verbRules["..."];
      if (verbRule?.rules) {
        const res = innerSearch(verbRule.rules, P, M, D);
        return {
          ...res,
          ending: "...", 
          verb,
          types: verbRule.type,
          abundance: verbRule.abundance,
          note: verbRule.note,
          afixo: null  // Sem afixo
        };
      }
    }

    // Verifica afixos válidos para verbos com terminações que começam com "..."
    const endingsThatStartWith = Object.keys(verbRules).filter(key => key.startsWith("..."));
    for (const ending of endingsThatStartWith) {
      const isValidPrefixForEnding = isValidPrefix(verb, sortedAfixos);
      if (isValidPrefixForEnding && verb.endsWith(ending.substring(3))) { // Remove "..."
        const baseVerbRules = verbRules[ending];
        if (baseVerbRules?.rules) {
          const res = innerSearch(baseVerbRules.rules, P, M, D);
          const afixoEncontrado = sortedAfixos.find((afixo) => verb.startsWith(afixo));
          return {
            ...res,
            ending, 
            verb,
            types: baseVerbRules.type,
            abundance: baseVerbRules.abundance,
            note: baseVerbRules.note,
            afixo: afixoEncontrado  // Retorna o afixo encontrado
          };
        }
      }
    }

    // Caso o verbo tenha regras diretamente associadas a ele
    if (verbRules[verb]) {
      const verbRule = verbRules[verb];
      if (verbRule?.rules) {
        const res = innerSearch(verbRule.rules, P, M, D);
        return {
          ...res,
          ending,  // Retorna a terminação específica (não mais todas as chaves)
          verb,
          types: verbRule.type,
          abundance: verbRule.abundance,
          note: verbRule.note,
          afixo: null  // Sem afixo
        };
      }
    }
  }

  // Caso o verbo não tenha uma terminação válida ou regras associadas
  return {
    hasTarget: false,
    rule: null,
    P: null,
    M: null,
    ending: null,
    verb: null,
    types: null,
    abundance: null,
    note: null,
    afixo: null  // Sem afixo
  };
}

// Exemplos de uso
const res1 = findNoRegRule("ir", "p1", "pr_ind", "VT");
console.log(res1); // Verifique se está retornando o ending como "ir"

const res2 = findNoRegRule("repor", "p1", "pr_ind", "VT");
console.log(res2); // Verifique se está retornando o ending como "repor"

const res3 = findNoRegRule("superpor", "p1", "pr_ind", "VT");
console.log(res3); // Verifique se está retornando o ending como "sotopor"
