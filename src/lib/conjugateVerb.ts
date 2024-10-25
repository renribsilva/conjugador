import reg from '../json/rulesForReg.json'; 
import { nw } from './normalizeVerb';
import { structureOfVerb } from './structureOfVerb';
import { findIrregRule } from './findIrregVerbs';

export const conjugateVerb = (verb: string) => {
  const r = verb.slice(0, -2); 
  const str = structureOfVerb(verb);
  const NOT_FOUND = "N/A";

  // Função para buscar a regra
  const F = (P: string, M: string, D: string): string | null => {
    const result = findIrregRule(verb, P, M, D);
    return result.hasTarget ? result.rule : NOT_FOUND;
  };

  // Função para obter dados do verbo
  const getVerbData = (P: string, M: string, num: number) => {
    const forRrule = findIrregRule(verb, P, M, "RAD").hasTarget;
    const forVTrule = findIrregRule(verb, P, M, "VT").hasTarget;
    const forMTrule = findIrregRule(verb, P, M, "MT").hasTarget;
    const forNPrule = findIrregRule(verb, P, M, "NP").hasTarget;
    const verbRules = reg[M]?.[str]; // Usar operador de encadeamento opcional

    if (!verbRules) return NOT_FOUND; // Se não encontrar regras para o verbo, retorna N/A

    const verbData = (forRrule || forVTrule || forMTrule || forNPrule)
      ? nw(`
          ${F(P, M, "RAD") === NOT_FOUND ? r : F(P, M, "RAD")}
          ${F(P, M, "VT") === NOT_FOUND ? verbRules.VT[num] : F(P, M, "VT")}
          ${F(P, M, "MT") === NOT_FOUND ? verbRules.MT[num] : F(P, M, "MT")}
          ${F(P, M, "NP") === NOT_FOUND ? verbRules.NP[num] : F(P, M, "NP")}*`)
      : nw(`
          ${r}
          ${verbRules.VT[num]}
          ${verbRules.MT[num]}
          ${verbRules.NP[num]}`);

    return verbData;
  };

  // Função para gerar as conjugações
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

  const N = (x: string) => {
    return {
        n: getVerbData("n", x, 0)
    };
  };

  // Gera as conjugações usando as terminações corretas
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

  // Gera as conjugações
  const conjugations = {};
  for (const [tense, reg] of Object.entries(conj)) {
    conjugations[tense] = reg; // Adiciona as terminações diretamente
  }

  return conjugations;
};
