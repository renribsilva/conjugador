import reg from '../json/rulesForReg.json'; 
import { findNoRegRule } from './findNoRegVerbs';
import { nw } from './normalizeVerb';
import { structureOfVerb } from './structureOfVerb';

export const conjugateVerb = (verb: string) => {
  const r = verb.slice(0, -2); 
  const r_m = verb.slice(0, -3); 
  const str = structureOfVerb(verb);
  const NOT_FOUND = "N/A";

  // Função auxiliar de F
  const F = (P: string, M: string, D: string): string => {
    const result = findNoRegRule(verb, P, M, D);
    const rule = result.hasTarget ? result.rule : NOT_FOUND;
    // console.log(rule)
    return rule ?? NOT_FOUND;  
  };

  // Função para obter dados do verbo
  const getVerbData = (P: string, M: string, num: number): string => {
    const forRrule = findNoRegRule(verb, P, M, "RAD").hasTarget;
    const forVTrule = findNoRegRule(verb, P, M, "VT").hasTarget;
    const forMTrule = findNoRegRule(verb, P, M, "MT").hasTarget;
    const forNPrule = findNoRegRule(verb, P, M, "NP").hasTarget;
    const verbRules = reg[M]?.[str];

    // console.log(verbRules)
    // console.log(forRrule)

    if (!verbRules) return NOT_FOUND;

    const verbData = (forRrule || forVTrule || forMTrule || forNPrule)
      ? nw(`
          ${F(P, M, "RAD") === NOT_FOUND ? r : F(P, M, "RAD")}
          ${F(P, M, "VT") === NOT_FOUND ? verbRules.VT[num] : F(P, M, "VT")}
          ${F(P, M, "MT") === NOT_FOUND ? verbRules.MT[num] : F(P, M, "MT")}
          ${F(P, M, "NP") === NOT_FOUND ? verbRules.NP[num] : F(P, M, "NP")}*`)
          .replace("...", r_m)
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

  // Conjugações
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

  // console.log(conj)

  // Retorna as conjugações
  const conjugations: Record<string, any> = {};
  for (const [tense, reg] of Object.entries(conj)) {
    conjugations[tense] = reg;
  }
  // console.log(conjugations)
  return conjugations;
};

// conjugateVerb("abraçar");
