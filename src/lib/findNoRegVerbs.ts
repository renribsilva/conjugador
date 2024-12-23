import irregularidades from '../json/rulesByTerm.json';  
import innerSearchOfRules from './innerSearchOfRules';
import { ni, nw } from './normalizeVerb';
import findVariations from './findVariations';

const terminations = Object.keys(irregularidades);
console.log(terminations)

function getVerbKeys(verb: string, terminations: string[]): any {

  terminations.sort((a, b) => b.length - a.length);

  const termination = terminations.find((end) => ni(verb).endsWith(ni(end)));  
  const rules = termination ? irregularidades[termination] : null;

  if (rules) {
    const normalizedRules = Object.keys(rules).reduce((acc, key) => {
      acc[ni(key)] = rules[key];
      return acc;
    }, {});

    //  console.log(termination)
    return { rules: normalizedRules, termination };
  }

  return { rules: null, termination };
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
      abundance1: {
        hasTarget: false,
        rule: null,
        P: null,
        M: null,
      },
      abundance2: {
        hasTarget: false,
        rule: null,
        P: null,
        M: null,
      }
    },
    termination: null,
    termEntrie: null,
    verb: null,
    types: null,
    note_plain: null,
    note_ref: null,
    afixo: null  
  };
}

export function findNoRegRule(verb: string, P: string, M: string, D: string) {

  const { rules: termEntries, termination } = getVerbKeys(verb, terminations);
  // console.log(termination)
  
  if (!termEntries) {
    return getDefaultResponse();
  }

  if (verb.startsWith("...")) {
    return getDefaultResponse();
  }

  if (termEntries[verb]) {

    const termEntrieObject = termEntries[verb];

    if (termEntrieObject?.rules) {

      const canonical = innerSearchOfRules(termEntrieObject.rules, P, M, D);
      const abundance1 = innerSearchOfRules(termEntrieObject.abundance1, P, M, D);
      const abundance2 = innerSearchOfRules(termEntrieObject.abundance2, P, M, D);

      return {
        results: {
          canonical: {...canonical},
          abundance1: {...abundance1},
          abundance2: {...abundance2}
        },
        termination,
        termEntrie: verb,
        verb,
        types: termEntrieObject.type,
        note_plain: termEntrieObject.note.plain,
        note_ref: termEntrieObject.note.ref,
        afixo: null  
      };
    }
  }

  const variationsProps = findVariations(verb);
  const terminationsThatStartWith = Object.keys(termEntries).filter(key => key.startsWith("..."));
  // console.log(terminationsThatStartWith)

  let terminationwithoutpunct = ''
  let verbwithoutprefix = variationsProps.processedInput;

  // console.log(terminationwithoutpunct)
  // console.log(verbwithoutprefix)

  if (terminationsThatStartWith.length > 0 && verbwithoutprefix !== null) {

    const match = terminationsThatStartWith.find(key => nw(key.replace("...", '')) === nw(verbwithoutprefix));

    if (match) {
      terminationwithoutpunct = match.replace("...", '');

    }
  }
  
  // console.log(variationsProps)
  // console.log(terminationwithoutpunct)
  // console.log(verbwithoutprefix)


  if (

    terminationsThatStartWith && 
    (terminationsThatStartWith.length === 1 && terminationsThatStartWith[0] !== "...") && 
    verbwithoutprefix !== null &&
    nw(terminationwithoutpunct) !== nw(verbwithoutprefix)

  ){

    return getDefaultResponse();

  }

  if ((termEntries[`...${terminationwithoutpunct}`] && nw(terminationwithoutpunct) === nw(verbwithoutprefix))) {

    const basetermEntries = termEntries[`...${verbwithoutprefix}`];

    if (basetermEntries?.rules) {

      const canonical = innerSearchOfRules(basetermEntries.rules, P, M, D);
      const abundance1 = innerSearchOfRules(basetermEntries.abundance1, P, M, D);
      const abundance2 = innerSearchOfRules(basetermEntries.abundance2, P, M, D);
      const foundedAfixo = variationsProps.matchingAfixo;

      return {
        results: {
          canonical: {...canonical},
          abundance1: {...abundance1},
          abundance2: {...abundance2}
        },
        termination,
        termEntrie: `...${terminationwithoutpunct}`,
        verb,
        types: basetermEntries.type,
        note_plain: basetermEntries.note.plain,
        note_ref: basetermEntries.note.ref,
        afixo: foundedAfixo  
      };
    }
  }

  if (termEntries["..."]) {

    const termEntrie = termEntries["..."];
    
    if (termEntrie?.rules) {

      const canonical = innerSearchOfRules(termEntrie.rules, P, M, D);
      const abundance1 = innerSearchOfRules(termEntrie.abundance1, P, M, D);
      const abundance2 = innerSearchOfRules(termEntrie.abundance2, P, M, D);
      
      return {
        results: {
          canonical: {...canonical},
          abundance1: {...abundance1},
          abundance2: {...abundance2}
        },
        termination,
        termEntrie: "...",
        verb,
        types: termEntrie.type,
        note_plain: termEntrie.note.plain,
        note_ref: termEntrie.note.ref,
        afixo: null  
      };
    }
  }

  return getDefaultResponse();

}

// const res = findNoRegRule('bem-dizer', 'p1','pr_ind',"VT")
// console.log(res)