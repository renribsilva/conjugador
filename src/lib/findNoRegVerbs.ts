import irregularidades from '../json/rulesByTerm.json';  
import innerSearchOfRules from './innerSearchOfRules';
import isValidPrefix from './isValidPrefix';
import { ni } from './normalizeVerb';

export function findNoRegRule(verb: string, P: string, M: string, D: string) {

  const endings = Object.keys(irregularidades); 

  function getVerbKeys(verb: string, endings: string[]): any {
    
    endings.sort((a, b) => b.length - a.length);
    const ending = endings.find((end) => ni(verb).endsWith(ni(end)));  
    const rules = ending ? irregularidades[ending] : null;
  
    if (rules) {
      const normalizedRules = Object.keys(rules).reduce((acc, key) => {
        acc[ni(key)] = rules[key];
        return acc;
      }, {});
      return { rules: normalizedRules, ending };
    }
  
    return { rules: null, ending };
  }  

  const { rules: verbRules, ending } = getVerbKeys(verb, endings); 

  // Se não houver regras, retorna a resposta padrão
  if (!verbRules) {
    return getDefaultResponse();
  }

  // Verifica se o verbo começa com "..."
  if (verb.startsWith("...")) {
    return getDefaultResponse();
  }

  // Verifica se o verbo tem uma regra diretamente associada
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
        note_plain: verbRule.note.plain,
        note_ref: verbRule.note.ref,
        afixo: null  
      };
    }
  }

  // Busca por terminações que começam com "..."
  const endingsThatStartWith = Object.keys(verbRules).filter(key => key.startsWith("..."));
  const prefixProps = isValidPrefix(verb);

  for (const ending of endingsThatStartWith) {
    if (prefixProps.isValid && verb.endsWith(ending.substring(3))) {
      const baseVerbRules = verbRules[ending];
      if (baseVerbRules?.rules) {
        const res = innerSearchOfRules(baseVerbRules.rules, P, M, D);
        const foundedAfixo = prefixProps.afixo;
        return {
          ...res,
          ending,
          verb,
          types: baseVerbRules.type,
          abundance: baseVerbRules.abundance,
          note_plain: baseVerbRules.note.plain,
          note_ref: baseVerbRules.note.ref,
          afixo: foundedAfixo  
        };
      }
    }
  }

  // Verifica a regra geral para terminações "..."
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
        note_plain: verbRule.note.plain,
        note_ref: verbRule.note.ref,
        afixo: null  
      };
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
      note_plain: null,
      note_ref: null,
      afixo: null  
    };
  }
}

// const res = findNoRegRule('rangir', 'p1','pr_ind',"RAD")
// console.log(res)