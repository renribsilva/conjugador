import reg from '../json/rulesForReg.json'; 
import { findNoRegRule } from './findNoRegVerbs';
import { ni, nw } from './normalizeVerb';
import { structureOfVerb } from './structureOfVerb';
import allVerbsData from "../json/allVerbs.json"

export const conjugateVerb = (verb: string) => {

  let r = nw(ni(verb)).slice(0, -2);
  let R = ''
  const str = structureOfVerb(verb);
  const NOT_FOUND = "N/A";

  const F = (P: string, M: string, D: string, key: string): string => {
    const result = findNoRegRule(verb, P, M, D);
    const rule = result.results[key].hasTarget ? result.results[key].rule : NOT_FOUND;
    return rule ?? NOT_FOUND; 
  };

  const getCanonical = (P: string, M: string, num: number, canonical: string): string => {
    
    const forRrule = findNoRegRule(verb, P, M, "RAD").results[canonical].hasTarget;
    const forVTrule = findNoRegRule(verb, P, M, "VT").results[canonical].hasTarget;
    const forMTrule = findNoRegRule(verb, P, M, "MT").results[canonical].hasTarget;
    const forNPrule = findNoRegRule(verb, P, M, "NP").results[canonical].hasTarget;

    const Rcontent = findNoRegRule(verb, P, M, "RAD").results[canonical].rule;
    const VTcontent = findNoRegRule(verb, P, M, "VT").results[canonical].rule;
    const MTcontent = findNoRegRule(verb, P, M, "MT").results[canonical].rule;
    const NPcontent = findNoRegRule(verb, P, M, "NP").results[canonical].rule;

    if (Rcontent !== null && typeof Rcontent === "string" && (Rcontent as string)) {

      let sliceLength: number;
      sliceLength = nw(Rcontent as string).match(/\d+/g)?.map(num => parseInt(num, 10))?.[0] || 0;
      let ralt = nw(Rcontent as string).replace("...", '').replace(/\d+/g,'')
      const originalR = r
      R = nw(originalR.slice(0,-sliceLength) + ralt)

    }

    const verbRules = reg[M]?.[str];

    if (!verbRules) return NOT_FOUND;  

    const canonicalData = (Rcontent === '' && VTcontent === '' && MTcontent === '' && NPcontent === '')
      ? '---'
      : (forRrule || forVTrule || forMTrule || forNPrule)
        ? (() => {
          let result = nw(`
            ${F(P, M, "RAD", canonical) === NOT_FOUND ? r : F(P, M, "RAD", canonical)}
            ${F(P, M, "VT", canonical) === NOT_FOUND ? verbRules.VT[num] : F(P, M, "VT", canonical)}
            ${F(P, M, "MT", canonical) === NOT_FOUND ? verbRules.MT[num] : F(P, M, "MT", canonical)}
            ${F(P, M, "NP", canonical) === NOT_FOUND ? verbRules.NP[num] : F(P, M, "NP", canonical)}*`);
          if (Rcontent !== null && Rcontent !== '') {
            result = result.replace(Rcontent, R);
          }
          return result;
        })()
        : nw(`
              ${r}
              ${verbRules.VT[num]}
              ${verbRules.MT[num]}
              ${verbRules.NP[num]}`);
    
    return canonicalData;

  };

  const getAbundance = (P: string, M: string, num: number, abundance: string): string | null => {
    
    const forRrule = findNoRegRule(verb, P, M, "RAD").results[abundance].hasTarget;
    const forVTrule = findNoRegRule(verb, P, M, "VT").results[abundance].hasTarget;
    const forMTrule = findNoRegRule(verb, P, M, "MT").results[abundance].hasTarget;
    const forNPrule = findNoRegRule(verb, P, M, "NP").results[abundance].hasTarget;

    const Rcontent = findNoRegRule(verb, P, M, "RAD").results[abundance].rule;
    const VTcontent = findNoRegRule(verb, P, M, "VT").results[abundance].rule;
    const MTcontent = findNoRegRule(verb, P, M, "MT").results[abundance].rule;
    const NPcontent = findNoRegRule(verb, P, M, "NP").results[abundance].rule;

    if (Rcontent !== null && typeof Rcontent === "string" && (Rcontent as string)) {

      let sliceLength: number;
      sliceLength = nw(Rcontent as string).match(/\d+/g)?.map(num => parseInt(num, 10))?.[0] || 0;
      let ralt = nw(Rcontent as string).replace("...", '').replace(/\d+/g,'')
      const originalR = r
      R = nw(originalR.slice(0,-sliceLength) + ralt)

    }

    const verbRules = reg[M]?.[str];

    if (!verbRules) return NOT_FOUND;  

    const abundanceData = (Rcontent === '' && VTcontent === '' && MTcontent === '' && NPcontent === '')
      ? '---'
      : (forRrule || forVTrule || forMTrule || forNPrule)
        ? (() => {
          let result = nw(`
            ${F(P, M, "RAD", abundance) === NOT_FOUND ? r : F(P, M, "RAD", abundance)}
            ${F(P, M, "VT", abundance) === NOT_FOUND ? verbRules.VT[num] : F(P, M, "VT", abundance)}
            ${F(P, M, "MT", abundance) === NOT_FOUND ? verbRules.MT[num] : F(P, M, "MT", abundance)}
            ${F(P, M, "NP", abundance) === NOT_FOUND ? verbRules.NP[num] : F(P, M, "NP", abundance)}*`);
          if (Rcontent !== null && Rcontent !== '') {
            result = result.replace(Rcontent, R);
          }
          return result;
        })()
        : nw('');

    if (abundanceData === '') {
      return null
    }
    return abundanceData;

  };

  const W = (x: string, P1: string | null = null, canonical: string) => {
    return {
        p1: [
          P1 ?? 
          getCanonical("p1", x, 0, canonical), 
          getAbundance("p1", x, 0, "abundance1"),
          getAbundance("p1", x, 0, "abundance2")
        ].filter(value => value !== null),
        p2: [
          getCanonical("p2", x, 1, canonical), 
          getAbundance("p2", x, 1, "abundance1"),
          getAbundance("p2", x, 1, "abundance2")
        ].filter(value => value !== null),
        p3: [
          getCanonical("p3", x, 2, canonical), 
          getAbundance("p3", x, 2, "abundance1"),
          getAbundance("p3", x, 2, "abundance2")
        ].filter(value => value !== null),
        p4: [
          getCanonical("p4", x, 3, canonical), 
          getAbundance("p4", x, 3, "abundance1"),
          getAbundance("p4", x, 3, "abundance2")
        ].filter(value => value !== null),
        p5: [
          getCanonical("p5", x, 4, canonical), 
          getAbundance("p5", x, 4, "abundance1"),
          getAbundance("p5", x, 4, "abundance2")
        ].filter(value => value !== null),
        p6: [
          getCanonical("p6", x, 5, canonical), 
          getAbundance("p6", x, 5, "abundance1"),
          getAbundance("p6", x, 5, "abundance2")
        ].filter(value => value !== null),
    };
  };

  const N = (x: string, canonical: string) => {
    return {
        n: [
          getCanonical("n", x, 0, canonical), 
          getAbundance("n", x, 0, "abundance1"),
          getAbundance("n", x, 0, "abundance2")
        ].filter(value => value !== null)
    };
  };

  const conj = {
    model: allVerbsData[verb].model,
    only_reflexive: allVerbsData[verb].only_reflexive,
    multiple_conj: allVerbsData[verb].multiple_conj,
    canonical1: { 
        gd: N("gd", "canonical1"),
        pa: N("pa", "canonical1"),
        pr_ind: W("pr_ind", null, "canonical1"),
        pt1_ind: W("pt1_ind", null, "canonical1"),
        pt2_ind: W("pt2_ind", null, "canonical1"),
        pt3_ind: W("pt3_ind", null, "canonical1"),
        ft1_ind: W("ft1_ind", null, "canonical1"),
        ft2_ind: W("ft2_ind", null, "canonical1"),
        pr_sub: W("pr_sub", null, "canonical1"),
        pt_sub: W("pt_sub", null, "canonical1"),
        fut_sub: W("fut_sub", null, "canonical1"),
        inf: W("inf", null, "canonical1"),
        im1: W("im1", "---", "canonical1"),
        im2: W("im2", "---", "canonical1")
    },
    canonical2: {
        gd: N("gd", "canonical2"),
        pa: N("pa", "canonical2"),
        pr_ind: W("pr_ind", null, "canonical2"),
        pt1_ind: W("pt1_ind", null, "canonical2"),
        pt2_ind: W("pt2_ind", null, "canonical2"),
        pt3_ind: W("pt3_ind", null, "canonical2"),
        ft1_ind: W("ft1_ind", null, "canonical2"),
        ft2_ind: W("ft2_ind", null, "canonical2"),
        pr_sub: W("pr_sub", null, "canonical2"),
        pt_sub: W("pt_sub", null, "canonical2"),
        fut_sub: W("fut_sub", null, "canonical2"),
        inf: W("inf", null, "canonical2"),
        im1: W("im1", "---", "canonical2"),
        im2: W("im2", "---", "canonical2")
    }
  };

  const conjugations: Record<string, any> = {};
  for (const [tense, reg] of Object.entries(conj)) {
    conjugations[tense] = reg;
  }

  // console.log(JSON.stringify(conjugations, null, 2));

  return conjugations;
  
};

// conjugateVerb("doer");