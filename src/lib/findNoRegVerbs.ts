import allVerbs from '../json/allVerbs.json';
import afixos from '../json/afixos.json';  
import irregularidades from '../json/rulesByTerm.json';  
import innerSearchOfRules from './innerSearchOfRules';
import { ni, nw } from './normalizeVerb';

export function findNoRegRule(verb: string, P: string, M: string, D: string) {

  const sortedAfixos = afixos.sort((a, b) => b.length - a.length);
  const normSortedAfixos = sortedAfixos.map(afixo => nw(afixo));
  const endings = Object.keys(irregularidades).sort((a, b) => b.length - a.length); 

  // console.log(endings)
  
  // Função para buscar regras para a terminação do verbo
  function getVerbKeys(verb: string, endings: string[]): any {
    
    let ending = endings.find((end) => ni(verb).endsWith(ni(end)));

    // console.log(ending)

    if (!ending) {
      for (let i = 0; i < endings.length; i++) {
        if (verb.endsWith(endings[i])) {
          ending = endings[i];
          break;
        }
      }
    }

    
    const rules = ending ? irregularidades[ending] : null;

    // console.log(ending)
  
    if (rules) {
      const normalizedRules = Object.keys(rules).reduce((acc, key) => {
        acc[ni(key)] = rules[key]; 
        return acc;
      }, {});
      return { rules: normalizedRules, ending };
    }

    return { rules: null, ending };
  }

  function isValidPrefix(verb: string, normSortedAfixos: string[]): boolean {    
    for (const afixo of normSortedAfixos) {
      if (verb.startsWith(afixo)) {
        
        const restOfVerb = verb.slice(afixo.length);
        // console.log(restOfVerb)
        
        if (allVerbs.hasOwnProperty(restOfVerb)) {
          return true;
        }
      }
    }
    
    return false;
  }

  const { rules: verbRules, ending } = getVerbKeys(verb, endings); 

  // console.log(verbRules)
  // console.log(ending)

  if (verbRules) {
    
    if (verb.startsWith("...")) {
      return getDefaultResponse(); 
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
          note_plain: verbRule.note.plain,
          note_ref: verbRule.note.ref,
          afixo: null  
        };
      }
    }

    const endingsThatStartWith = Object.keys(verbRules).filter(key => key.startsWith("..."));

    // console.log(endingsThatStartWith)

    for (const ending of endingsThatStartWith) {
      if (isValidPrefix(verb, normSortedAfixos) && verb.endsWith(ending.substring(3))) {
        const baseVerbRules = verbRules[ending];
        if (baseVerbRules?.rules) {
          const res = innerSearchOfRules(baseVerbRules.rules, P, M, D);
          const foundedAfixo = normSortedAfixos.find((afixo) => verb.startsWith(afixo));
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

// const res3 = findNoRegRule("tacar", "p1", "alt", "RAD");
// console.log(res3); 
