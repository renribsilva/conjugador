'use server'

import { ni, nw } from "./normalizeVerb";

export function getVerbKeys(verb: string, terminations: string[], regJson: object): any {

  terminations.sort((a, b) => b.length - a.length);

  const termination = terminations.find((end) => ni(verb).endsWith(ni(end)));  
  const terminationData = termination ? regJson[termination] : null;
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

export function getDefaultResponse() {
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