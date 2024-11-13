import afixos from '../json/afixos.json';  // Carrega afixos.json
import irregularidades from '../json/rulesForNoReg.json';  // Carrega rulesForNoReg.json
import { ni } from './normalizeVerb';

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
  const sortedAfixos = afixos.sort((a, b) => b.length - a.length);  // Ordena afixos
  const endings = Object.keys(irregularidades).sort((a, b) => b.length - a.length);  // Ordena terminações
  
  // Função para buscar regras para a terminação do verbo
  function getVerbKeys(verb: string, endings: string[]): any {
    const ending = endings.find((end) => verb.endsWith(end));
    const rules = ending ? irregularidades[ending] : null;
  
    if (rules) {
      const normalizedRules: any = {};
      Object.keys(rules).forEach(key => {
        normalizedRules[ni(key)] = rules[key]; // Normaliza a chave e mantém o valor
      });
      return { rules: normalizedRules, ending }; 
    }

    return { rules: null, ending }; 
  }

  // Função para verificar se o verbo começa com um afixo válido
  function isValidPrefix(verb: string, sortedAfixos: string[]): boolean {
    return sortedAfixos.some((afixo) => verb.startsWith(afixo));
  }

  const { rules: verbRules, ending } = getVerbKeys(verb, endings); 

  // Caso o verbo tenha regras associadas
  if (verbRules) {
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
        afixo: null  
      };
    }

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
          afixo: null  
        };
      }
    }

    const endingsThatStartWith = Object.keys(verbRules).filter(key => key.startsWith("..."));
    for (const ending of endingsThatStartWith) {
      const isValidPrefixForEnding = isValidPrefix(verb, sortedAfixos);
      if (isValidPrefixForEnding && verb.endsWith(ending.substring(3))) {
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
            afixo: afixoEncontrado  
          };
        }
      }
    }

    if (verbRules[verb]) {
      const verbRule = verbRules[verb];
      if (verbRule?.rules) {
        const res = innerSearch(verbRule.rules, P, M, D);
        return {
          ...res,
          ending,
          verb,
          types: verbRule.type,
          abundance: verbRule.abundance,
          note: verbRule.note,
          afixo: null  
        };
      }
    }
  }

  // Caso o verbo não tenha regras associadas
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
    afixo: null  
  };
}

// Exemplos de uso (comentados)
// const res1 = findNoRegRule("ir", "p1", "pr_ind", "VT");
// console.log(res1); 

// const res2 = findNoRegRule("por", "p1", "pr_ind", "VT");
// console.log(res2); 

// const res3 = findNoRegRule("acabar", "p1", "pr_ind", "VT");
// console.log(res3); 
