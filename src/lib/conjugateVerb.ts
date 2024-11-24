import reg from '../json/rulesForReg.json'; 
import { findNoRegRule } from './findNoRegVerbs';
import { ni, nw } from './normalizeVerb';
import { structureOfVerb } from './structureOfVerb';

export const conjugateVerb = (verb: string) => {

  let r = nw(ni(verb)).slice(0, -2);
  let R = ''
  const str = structureOfVerb(verb);
  const NOT_FOUND = "N/A";

  // Função auxiliar de F
  const F = (P: string, M: string, D: string): string => {
    const result = findNoRegRule(verb, P, M, D);
    const rule = result.hasTarget ? result.rule : NOT_FOUND;
    return rule ?? NOT_FOUND; 
  };

  // Função para obter dados do verbo
  const getVerbData = (P: string, M: string, num: number): string => {
    
    const forRrule = findNoRegRule(verb, P, M, "RAD").hasTarget;
    const forVTrule = findNoRegRule(verb, P, M, "VT").hasTarget;
    const forMTrule = findNoRegRule(verb, P, M, "MT").hasTarget;
    const forNPrule = findNoRegRule(verb, P, M, "NP").hasTarget;

    const Rcontent = findNoRegRule(verb, P, M, "RAD").rule;
    const VTcontent = findNoRegRule(verb, P, M, "VT").rule;
    const MTcontent = findNoRegRule(verb, P, M, "MT").rule;
    const NPcontent = findNoRegRule(verb, P, M, "NP").rule;

    if (Rcontent !== null && typeof Rcontent === "string" && (Rcontent as string)) {

      let sliceLength: number;
      sliceLength = nw(Rcontent as string).match(/\d+/g)?.map(num => parseInt(num, 10))?.[0] || 0;
      let ralt = nw(Rcontent as string).replace("...", '').replace(/\d+/g,'')
      const originalR = r
      R = nw(originalR.slice(0,-sliceLength) + ralt)

    }

    const verbRules = reg[M]?.[str];

    if (!verbRules) return NOT_FOUND;   
    
    // console.log(Rcontent)

    const verbData = (Rcontent === '' && VTcontent === '' && MTcontent === '' && NPcontent === '')
      ? '---'
      : (forRrule || forVTrule || forMTrule || forNPrule)
        ? (() => {
          let result = nw(`
            ${F(P, M, "RAD") === NOT_FOUND ? r : F(P, M, "RAD")}
            ${F(P, M, "VT") === NOT_FOUND ? verbRules.VT[num] : F(P, M, "VT")}
            ${F(P, M, "MT") === NOT_FOUND ? verbRules.MT[num] : F(P, M, "MT")}
            ${F(P, M, "NP") === NOT_FOUND ? verbRules.NP[num] : F(P, M, "NP")}*`);
          if (Rcontent !== null) {
            result = result.replace(Rcontent, R);
          }
          return result;
        })()
        : nw(`
              ${r}
              ${verbRules.VT[num]}
              ${verbRules.MT[num]}
              ${verbRules.NP[num]}`);
    
    return verbData;
  };

  // Função para gerar conjugação
  const W = (x: string, P1: string | null = null) => {
    return {
        p1: P1 ?? getVerbData("p1", x, 0),
        p2: getVerbData("p2", x, 1),
        p3: getVerbData("p3", x, 2),
        p4: getVerbData("p4", x, 3),
        p5: getVerbData("p5", x, 4),
        p6: getVerbData("p6", x, 5),
    };
  };

  // Função para gerar conjugação no singular
  const N = (x: string) => {
    return {
        n: getVerbData("n", x, 0)
    };
  };

  const conj = {
    gd: N("gd"),
    pa: N("pa"),  
    pr_ind: W("pr_ind"),
    pt1_ind: W("pt1_ind"),
    pt2_ind: W("pt2_ind"),
    pt3_ind: W("pt3_ind"),
    ft1_ind: W("ft1_ind"),
    ft2_ind: W("ft2_ind"),   
    pr_sub: W("pr_sub"),
    pt_sub: W("pt_sub"),
    fut_sub: W("fut_sub"),
    inf: W("inf"),
    im1: W("im1", "---"),
    im2: W("im2", "---"),         
  };

  const conjugations: Record<string, any> = {};
  for (const [tense, reg] of Object.entries(conj)) {
    conjugations[tense] = reg;
  }

  // console.log(conjugations)
  return conjugations;
  
};

// conjugateVerb("desabrir");