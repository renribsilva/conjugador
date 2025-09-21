import { VerbProps } from "../types";
import { findTermRule } from "./findTermRules";
import { getModelsData } from "./getModelsData";

const resultCache = new Map<string, ReturnType<typeof findTermRule>>();

function mapTypesToStrings(types: any) {
  const typeDescriptions: Record<number, string> = {
    1: "regular",
    2: "irregular",
    3: "defectivo",
    4: "abundante",
    5: "anômalo",
  };

  return types.map((type) => typeDescriptions[type] || "tipo desconhecido");
}

export function getTermData(verb: string, P: string, M: string, type: string) {
  
  const cacheKey = `${verb}|${P}|${M}|${type}`;

  let result = resultCache.get(cacheKey);

  if (!result) {
    result = findTermRule(verb, P, M, type);
    resultCache.set(cacheKey, result);
  }

  const validTypes = [1, 2]; // Tipos válidos
  const mappedTypes = result.types?.length ? mapTypesToStrings(result.types) : null;
  const note_plain = result.note_plain && result.note_plain.length > 0 ? result.note_plain : null;
  const note_ref = result.note_ref && Object.keys(result.note_ref).length > 0 ? result.note_ref : null;

  let verbProps: VerbProps = {
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
    model: null,
  };

  if (result.types.some((type) => validTypes.includes(type))) {
    verbProps = {
      hasTargetCanonical1: result.results.canonical1.hasTarget,
      hasTargetCanonical2: result.results.canonical2.hasTarget,
      hasTargetAbundance1: result.results.abundance1.hasTarget,
      hasTargetAbundance2: result.results.abundance2.hasTarget,
      termination: result.termination,
      termEntrie: result.termEntrie,
      verb,
      types: mappedTypes,
      note_plain,
      note_ref,
      afixo: result.afixo,
      model: getModelsData(verb),
    };
  }

  return {
    verbProps,
    result,
  };
}