import irregularidades from '../json/rulesByTerm.json';  
import innerSearchOfRules from './innerSearchOfRules';
import { ni, nw } from './normalizeVerb';
import findVariations from './findVariations';

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

function getDefaultResponse() {
  return {
    results: {
      canonical: {
        hasTarget: false,
        rule: null,
        P: null,
        M: null,
      },
      abundance: {
        hasTarget: false,
        rule: null,
        P: null,
        M: null,
      }
    },
    ending: null,
    verb: null,
    types: null,
    note_plain: null,
    note_ref: null,
    afixo: null  
  };
}

export function findNoRegRule(verb: string, P: string, M: string, D: string) {

  const { rules: verbRules, ending } = getVerbKeys(verb, endings);
  // console.log(verbRules)
  
  if (!verbRules) {
    return getDefaultResponse();
  }

  if (verb.startsWith("...")) {
    return getDefaultResponse();
  }

  if (verbRules[verb]) {
    const verbRule = verbRules[verb];
    if (verbRule?.rules) {

      const canonical = innerSearchOfRules(verbRule.rules, P, M, D);
      const abundance = innerSearchOfRules(verbRule.abundance, P, M, D);

      return {
        results: {
          canonical: {...canonical},
          abundance: {...abundance}
        },
        ending,
        verb,
        types: verbRule.type,
        note_plain: verbRule.note.plain,
        note_ref: verbRule.note.ref,
        afixo: null  
      };
    }
  }

  const variationsProps = findVariations(verb);
  const endingsThatStartWith = Object.keys(verbRules).filter(key => key.startsWith("..."));
  // console.log(endingsThatStartWith)

  let endingwithoutpunct = ''
  let verbwithoutprefix = variationsProps.processedInput;

  // console.log(endingwithoutpunct)
  // console.log(verbwithoutprefix)

  if (endingsThatStartWith.length > 0 && verbwithoutprefix !== null) {

    const match = endingsThatStartWith.find(key => nw(key.replace("...", '')) === nw(verbwithoutprefix));

    if (match) {
      endingwithoutpunct = match.replace("...", '');

    }
  }
  
  // console.log(variationsProps)
  // console.log(endingwithoutpunct)
  // console.log(verbwithoutprefix)


  if (

    endingsThatStartWith && 
    endingsThatStartWith[0] !== "..." && 
    verbwithoutprefix !== null &&
    nw(endingwithoutpunct) !== nw(verbwithoutprefix)

  ){

    return getDefaultResponse();

  }

  for (const ending of endingsThatStartWith) {
    if (verb.endsWith(ending.substring(3))) {
      const baseVerbRules = verbRules[ending];
      if (baseVerbRules?.rules) {

        const canonical = innerSearchOfRules(baseVerbRules.rules, P, M, D);
        const abundance = innerSearchOfRules(baseVerbRules.abundance, P, M, D);
        const foundedAfixo = variationsProps.matchingAfixo;

        return {
          results: {
            canonical: {...canonical},
            abundance: {...abundance}
          },
          ending,
          verb,
          types: baseVerbRules.type,
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

      const canonical = innerSearchOfRules(verbRule.rules, P, M, D);
      const abundance = innerSearchOfRules(verbRule.abundance, P, M, D);
      
      return {
        results: {
          canonical: {...canonical},
          abundance: {...abundance}
        },
        ending: "...",
        verb,
        types: verbRule.type,
        note_plain: verbRule.note.plain,
        note_ref: verbRule.note.ref,
        afixo: null  
      };
    }
  }

  return getDefaultResponse();

}

// const res = findNoRegRule('prazer', 'p3','pr_ind',"VT")
// console.log(res)