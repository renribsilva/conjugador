import { findTermRule } from "./findTermVerbs";
import allVerbsData from '../json/allVerbs.json'
import modelsData from '../json/models.json'
import groupedModelsData from '../json/groupedModels.json'

interface VerbProps {
  hasTargetCanonical1: boolean | null;
  hasTargetCanonical2: boolean | null;
  hasTargetAbundance1: boolean | null;
  hasTargetAbundance2: boolean | null;
  termination: string | null;
  termEntrie: string | null | undefined;
  verb: string | null;
  types: string[] | null;
  note_plain: string[] | null;
  note_ref: object | null;
  afixo: string | null | undefined;
  model: object | null
}

function mapTypesToStrings(types: any) {
  const typeDescriptions: Record<number, string> = {
    1: "regular",
    2: "irregular",
    3: "defectivo",
    4: "abundante",
    5: "anômalo"
  };

  return types.map(type => typeDescriptions[type] || "tipo desconhecido");
}

export async function getPropsOfVerb(
  verb: string, 
  isValidVerb: boolean, 
  validVerb: string): Promise<VerbProps[]> 
  {

  const P = ["p1", "p2", "p3", "p4", "p5", "p6", "n"];
  const M = ["gd", "pa", "pr_ind", "pt1_ind", "pt2_ind", "pt3_ind", "ft1_ind", "ft2_ind", 
             "pr_sub", "pt_sub", "fut_sub", "inf", "im1", "im2"];
  const D = ["RAD", "VT", "MT", "NP"];

  const validTypes = [1, 2]; // Tipos válidos

  const resultsMap = new Map<string, VerbProps>();
  // console.log(resultsMap)

  const modelNumbers = allVerbsData[verb]?.model || [];

  const accumulatedData: Record<string, any[]> = {};

  modelNumbers.forEach((num: number) => {
    const model = modelsData[num];
    const verbKey = model?.ref?.[0];
    const totalKey = model?.total?.[0];
    const groupKey = model?.group?.[0];
    const groupDescription = groupedModelsData[groupKey]?.[0];

    if (!accumulatedData.modelNumber) accumulatedData.modelNumber = [];
    if (!accumulatedData.verbRef) accumulatedData.verbRef = [];
    if (!accumulatedData.total) accumulatedData.total = [];
    if (!accumulatedData.group) accumulatedData.group = [];
    if (!accumulatedData.groupDescription) accumulatedData.groupDescription = [];

    accumulatedData.modelNumber.push(num);
    if (verbKey) accumulatedData.verbRef.push(verbKey);
    if (totalKey) accumulatedData.total.push(totalKey);
    if (groupKey) accumulatedData.group.push(groupKey);
    if (groupDescription) accumulatedData.groupDescription.push(groupDescription);
  });

  // console.log(accumulatedData);

  // Iterando sobre as combinações P, M, D
  for (let p of P) {
    for (let m of M) {
      for (let d of D) {

        const result = findTermRule(verb, p, m, d);
        // console.log(result)

        if (result) {

          const mappedTypes = result.types?.length ? mapTypesToStrings(result.types) : null;
          const note_plain = result.note_plain && result.note_plain.length > 0 ? result.note_plain : null;
          const note_ref = result.note_ref && Object.keys(result.note_ref).length > 0 ? result.note_ref : null;

          if (result.termination !== null) {
            if (result.types.some(type => validTypes.includes(type))) {

              const verbProps: VerbProps = {

                hasTargetCanonical1: result.results.canonical1.hasTarget,
                hasTargetCanonical2: result.results.canonical2.hasTarget,
                hasTargetAbundance1: result.results.abundance1.hasTarget, 
                hasTargetAbundance2: result.results.abundance2.hasTarget,                
                termination: result.termination,
                termEntrie: result.termEntrie,
                verb: validVerb,
                types: mappedTypes,
                note_plain,
                note_ref,
                afixo: result.afixo,
                model: accumulatedData

              };

              const key = `${validVerb}-${p}-${m}-${d}`;

              if (!resultsMap.has(key)) {
                resultsMap.set(key, verbProps);
              }

              // console.log(resultsMap)

            }

          } else if (result.types === null && isValidVerb) {
            
            const verbProps: VerbProps = {
              hasTargetCanonical1: result.results.canonical1.hasTarget,
              hasTargetCanonical2: result.results.canonical2.hasTarget,
              hasTargetAbundance1: result.results.abundance1.hasTarget,
              hasTargetAbundance2: result.results.abundance2.hasTarget,
              termination: result.termination,
              termEntrie: result.termEntrie,
              verb: validVerb,
              types: mappedTypes,
              note_plain,
              note_ref,
              afixo: result.afixo,
              model: accumulatedData
            };

            const key = `${validVerb}-${p}-${m}-${d}`;

            if (!resultsMap.has(key)) {
              resultsMap.set(key, verbProps);
            }

          }
        }
      }
    }
  }

  // console.log(resultsMap)

  const uniqueResults: VerbProps[] = Array.from(resultsMap.values());

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
      hasTargetCanonical1: null,
      hasTargetCanonical2: null,
      hasTargetAbundance1: null,
      hasTargetAbundance2: null,
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

  return [accumulatedResult];

}

getPropsOfVerb("aceitar", true, "aceitar").then(test => {
  console.log(test);
});