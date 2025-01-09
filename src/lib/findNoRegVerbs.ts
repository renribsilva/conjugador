import irregularidades from '../json/rulesByTerm.json';  
import innerSearchOfRules from './innerSearchOfRules';
import { ni, nw } from './normalizeVerb';
import findVariations from './findVariations';

const terminations = Object.keys(irregularidades);
// console.log(terminations)

function getVerbKeys(verb: string, terminations: string[]): any {

  terminations.sort((a, b) => b.length - a.length);

  const termination = terminations.find((end) => ni(verb).endsWith(ni(end)));  
  const terminationData = termination ? irregularidades[termination] : null;
  // console.log(terminationData)

  if (terminationData) {
    const normalizedCanonical = Object.keys(terminationData).reduce((acc, key) => {
      acc[nw(key)] = terminationData[key];
      return acc;
    }, {});

    //  console.log(termination)
    return { terminationData: normalizedCanonical, termination };
  }

  return { terminationData: null, termination };
}

function getDefaultResponse() {
  return {
    results: {
      canonical1: {
        hasTarget: false,
        rule: null,
        P: null,
        M: null,
      },
      canonical2: {
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

  const { terminationData: terminationData, termination } = getVerbKeys(verb, terminations);
  // console.log(termination)
  if (!terminationData) {
    return getDefaultResponse();
  }

  if (verb.startsWith("...")) {
    return getDefaultResponse();
  }

  const keysTermData = Object.keys(terminationData)

  let key = '';

  for (const eachkey of keysTermData) {
    const normalizedKey = ni(eachkey);
    if (normalizedKey === verb) {
      key = eachkey;
      break;
    }
  }

  if (key !== '' && terminationData[key]) {

    const termEntrieObject = terminationData[key];

    if (termEntrieObject?.canonical1) {

      const canonical1 = innerSearchOfRules(termEntrieObject.canonical1, P, M, D);
      const canonical2 = innerSearchOfRules(termEntrieObject.canonical2, P, M, D);
      const abundance1 = innerSearchOfRules(termEntrieObject.abundance1, P, M, D);
      const abundance2 = innerSearchOfRules(termEntrieObject.abundance2, P, M, D);

      return {
        results: {
          canonical1: {...canonical1},
          canonical2: {...canonical2},
          abundance1: {...abundance1},
          abundance2: {...abundance2}
        },
        termination,
        termEntrie: key,
        verb,
        types: termEntrieObject.type,
        note_plain: termEntrieObject.note.plain,
        note_ref: termEntrieObject.note.ref,
        afixo: null  
      };
    }
  }

  const variationsProps = findVariations(verb);
  const terminationsThatStartWith = Object.keys(terminationData).filter(key => key.startsWith("..."));
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

  if ((terminationData[`...${terminationwithoutpunct}`] && nw(terminationwithoutpunct) === nw(verbwithoutprefix))) {

    const baseterminationData = terminationData[`...${verbwithoutprefix}`];

    if (baseterminationData?.canonical1) {

      const canonical1 = innerSearchOfRules(baseterminationData.canonical1, P, M, D);
      const canonical2 = innerSearchOfRules(baseterminationData.canonical2, P, M, D);
      const abundance1 = innerSearchOfRules(baseterminationData.abundance1, P, M, D);
      const abundance2 = innerSearchOfRules(baseterminationData.abundance2, P, M, D);
      const foundedAfixo = variationsProps.matchingAfixo;

      return {
        results: {
          canonical1: {...canonical1},
          canonical2: {...canonical2},
          abundance1: {...abundance1},
          abundance2: {...abundance2}
        },
        termination,
        termEntrie: `...${terminationwithoutpunct}`,
        verb,
        types: baseterminationData.type,
        note_plain: baseterminationData.note.plain,
        note_ref: baseterminationData.note.ref,
        afixo: foundedAfixo  
      };
    }
  }

  if (terminationData["..."]) {

    const termEntrie = terminationData["..."];
    
    if (termEntrie?.canonical1) {

      const canonical1 = innerSearchOfRules(termEntrie.canonical1, P, M, D);
      const canonical2 = innerSearchOfRules(termEntrie.canonical2, P, M, D);
      const abundance1 = innerSearchOfRules(termEntrie.abundance1, P, M, D);
      const abundance2 = innerSearchOfRules(termEntrie.abundance2, P, M, D);
      
      return {
        results: {
          canonical1: {...canonical1},
          canonical2: {...canonical2},
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

// const res = findNoRegRule('ser', 'p3','pt2_ind',"RAD")
// console.log(res)