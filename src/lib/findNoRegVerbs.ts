import afixos from '../json/afixos.json';  // Carrega afixos.json
import irregularidades from '../json/rulesByTerm.json';  // Carrega rulesForNoReg.json
import innerSearchOfRules from './innerSearchOfRules';
import { ni } from './normalizeVerb';

// Função principal para encontrar a regra de um verbo
export function findNoRegRule(verb: string, P: string, M: string, D: string) {

  const sortedAfixos = afixos.sort((a, b) => b.length - a.length);  
  const endings = Object.keys(irregularidades).sort((a, b) => b.length - a.length); 
  
  // Função para buscar regras para a terminação do verbo
  function getVerbKeys(verb: string, endings: string[]): any {
    const ending = endings.find((end) => verb.endsWith(end));
    const rules = ending ? irregularidades[ending] : null;
  
    if (rules) {
      const normalizedRules = Object.keys(rules).reduce((acc, key) => {
        acc[ni(key)] = rules[key];  // Normaliza a chave e mantém o valor
        return acc;
      }, {});
      return { rules: normalizedRules, ending };
    }

    return { rules: null, ending };
  }

  // Função para verificar se o verbo começa com um afixo válido
  function isValidPrefix(verb: string, sortedAfixos: string[]): boolean {
    return sortedAfixos.some((afixo) => verb.startsWith(afixo));
  }

  const { rules: verbRules, ending } = getVerbKeys(verb, endings); 

  if (verbRules) {
    if (verb.startsWith("...")) {
      return getDefaultResponse(); 
    }

    if (verbRules["..."]) {
      const verbRule = verbRules["..."];
      if (verbRule?.rules) {
        const res = innerSearchOfRules(verbRule.rules, P, M, D);
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
      if (isValidPrefix(verb, sortedAfixos) && verb.endsWith(ending.substring(3))) {
        const baseVerbRules = verbRules[ending];
        if (baseVerbRules?.rules) {
          const res = innerSearchOfRules(baseVerbRules.rules, P, M, D);
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
        const res = innerSearchOfRules(verbRule.rules, P, M, D);
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

  return getDefaultResponse();
  
  function getDefaultResponse() {
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
}

// const res3 = findNoRegRule("propor", "p1", "pr_ind", "VT");
// console.log(res3); 
