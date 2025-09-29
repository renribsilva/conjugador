import reg from '../json/rulesForReg.json';
import { ni, nw } from './normalizeVerb';
import { structureOfVerb } from './structureOfVerb';
import allVerbsData from "../json/allVerbs.json"
import { getTermData } from './getTermData';
import { VerbProps } from '../types';

export function conjugateVerb (verb: string) {

  let r = nw(ni(verb)).slice(0, -2);
  let R = ''
  const str = structureOfVerb(verb);
  const NOT_FOUND = "N/A";

  const verbPropsMap = new Map<string, VerbProps>();
  const termDataCache = new Map();

  const F = (P: string, M: string, D: string, canonical: string): string => {
    const cacheKey = `${verb}_${P}_${M}_${D}_${canonical}`;
    if (termDataCache.has(cacheKey)) {
      const result = termDataCache.get(cacheKey)
      const rule = result.result.results[canonical].hasTarget 
        ? result.result.results[canonical].rule 
        : NOT_FOUND;
      return rule ?? NOT_FOUND; 
    } else {
      return NOT_FOUND
    }
  };

  const getCachedTermData = (verb: string, P: string, M: string, D: string, canonical: string) => {
    const cacheKey = `${verb}_${P}_${M}_${D}_${canonical}`;
    if (termDataCache.has(cacheKey)) {
      // console.log("use cachê")
      return termDataCache.get(cacheKey);
    }
    const data = getTermData(verb, P, M, D);
    termDataCache.set(cacheKey, data);
    return data;
  }

  const getCanonical = (P: string, M: string, num: number, canonical: string): string => {
    
    const RADData = getCachedTermData(verb, P, M, "RAD", canonical);
    const VTData = getCachedTermData(verb, P, M, "VT", canonical);
    const MTData = getCachedTermData(verb, P, M, "MT", canonical);
    const NPData = getCachedTermData(verb, P, M, "NP", canonical);

    verbPropsMap.set('RAD', RADData.verbProps);
    verbPropsMap.set('VT', VTData.verbProps);
    verbPropsMap.set('MT', MTData.verbProps);
    verbPropsMap.set('NP', NPData.verbProps);

    const forRrule = RADData.result.results[canonical].hasTarget
    const forVTrule = VTData.result.results[canonical].hasTarget
    const forMTrule = MTData.result.results[canonical].hasTarget
    const forNPrule = NPData.result.results[canonical].hasTarget

    const Rcontent = RADData.result.results[canonical].rule
    const VTcontent = VTData.result.results[canonical].rule
    const MTcontent = MTData.result.results[canonical].rule
    const NPcontent = NPData.result.results[canonical].rule

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
    
    const RADData = getCachedTermData(verb, P, M, "RAD", abundance);
    const VTData = getCachedTermData(verb, P, M, "VT", abundance);
    const MTData = getCachedTermData(verb, P, M, "MT", abundance);
    const NPData = getCachedTermData(verb, P, M, "NP", abundance);

    const forRrule = RADData.result.results[abundance].hasTarget
    const forVTrule = VTData.result.results[abundance].hasTarget
    const forMTrule = MTData.result.results[abundance].hasTarget
    const forNPrule = NPData.result.results[abundance].hasTarget

    const Rcontent = RADData.result.results[abundance].rule
    const VTcontent = VTData.result.results[abundance].rule
    const MTcontent = MTData.result.results[abundance].rule
    const NPcontent = NPData.result.results[abundance].rule

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

  const uniqueResults: VerbProps[] = Array.from(verbPropsMap.values());

  const accumulatedResult: VerbProps = uniqueResults.reduce(
    (acc, curr) => ({
      hasTargetCanonical1: acc.hasTargetCanonical1 || curr.hasTargetCanonical1,
      hasTargetCanonical2: acc.hasTargetCanonical2 || curr.hasTargetCanonical2,
      hasTargetAbundance1: acc.hasTargetAbundance1 || curr.hasTargetAbundance1,
      hasTargetAbundance2: acc.hasTargetAbundance2 || curr.hasTargetAbundance2,
      termination: curr.termination || acc.termination,
      termEntrie: curr.termEntrie|| acc.termEntrie,
      verb: curr.verb || acc.verb,
      types: curr.types || acc.types,
      note_plain: curr.note_plain || acc.note_plain,
      note_ref: curr.note_ref || acc.note_ref,
      afixo: curr.afixo || acc.afixo,
      model: curr.model || acc.model
    }),
    {
      hasTargetCanonical1: false,
      hasTargetCanonical2: false,
      hasTargetAbundance1: false,
      hasTargetAbundance2: false,
      termination: null,
      termEntrie: null,
      verb: null,
      types: null,
      note_plain: null,
      note_ref: null,
      afixo: null,
      model: null
    }
  );

  // console.log(accumulatedResult)

  const conjugations: Record<string, any> = {};
  for (const [tense, reg] of Object.entries(conj)) {
    conjugations[tense] = reg;
  }

  // console.log(JSON.stringify(conjugations, null, 2));

  return {
    conjugations: conjugations,
    propOfVerb: accumulatedResult
  };
  
};

// conjugateVerb("renato");