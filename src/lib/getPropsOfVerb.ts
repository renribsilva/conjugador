import { findNoRegRule } from "./findNoRegVerbs";

interface VerbProps {
  hasTargetCanonical: boolean | null;
  hasTargetAbundance1: boolean | null;
  hasTargetAbundance2: boolean | null;
  termination: string | null;
  termEntrie: string | null | undefined;
  verb: string | null;
  types: string[] | null;
  note_plain: string[] | null;
  note_ref: object | null;
  afixo: string | null | undefined;
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

export async function getPropsOfVerb(verb: string, isValidVerb: boolean, validVerb: string): Promise<VerbProps[]> {
  const P = ["p1", "p2", "p3", "p4", "p5", "p6", "n"];
  const M = ["gd", "pa", "pr_ind", "pt1_ind", "pt2_ind", "pt3_ind", "ft1_ind", "ft2_ind", 
             "pr_sub", "pt_sub", "fut_sub", "inf", "im1", "im2"];
  const D = ["RAD", "VT", "MT", "NP"];

  const validTypes = [1, 2]; // Tipos válidos

  const resultsMap = new Map<string, VerbProps>();
  // console.log(resultsMap)

  // Iterando sobre as combinações P, M, D
  for (let p of P) {
    for (let m of M) {
      for (let d of D) {

        const result = findNoRegRule(verb, p, m, d);
        // console.log(result)

        if (result) {

          const mappedTypes = result.types?.length ? mapTypesToStrings(result.types) : null;
          const note_plain = result.note_plain && result.note_plain.length > 0 ? result.note_plain : null;
          const note_ref = result.note_ref && Object.keys(result.note_ref).length > 0 ? result.note_ref : null;

          if (result.termination !== null) {
            if (result.types.some(type => validTypes.includes(type))) {

              const verbProps: VerbProps = {

                hasTargetCanonical: result.results.canonical.hasTarget,
                hasTargetAbundance1: result.results.abundance1.hasTarget, 
                hasTargetAbundance2: result.results.abundance2.hasTarget,                
                termination: result.termination,
                termEntrie: result.termEntrie,
                verb: validVerb,
                types: mappedTypes,
                note_plain,
                note_ref,
                afixo: result.afixo

              };

              const key = `${validVerb}-${p}-${m}-${d}`;

              if (!resultsMap.has(key)) {
                resultsMap.set(key, verbProps);
              }

              // console.log(resultsMap)

            }

          } else if (result.types === null && isValidVerb) {
            
            const verbProps: VerbProps = {
              hasTargetCanonical: result.results.canonical.hasTarget,
              hasTargetAbundance1: result.results.abundance1.hasTarget,
              hasTargetAbundance2: result.results.abundance2.hasTarget,
              termination: result.termination,
              termEntrie: result.termEntrie,
              verb: validVerb,
              types: ["regular"],
              note_plain,
              note_ref,
              afixo: result.afixo
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
      hasTargetCanonical: acc.hasTargetCanonical || curr.hasTargetCanonical,
      hasTargetAbundance1: acc.hasTargetAbundance1 || curr.hasTargetAbundance1,
      hasTargetAbundance2: acc.hasTargetAbundance2 || curr.hasTargetAbundance2,
      termination: curr.termination || acc.termination,
      termEntrie: curr.termEntrie|| acc.termEntrie,
      verb: curr.verb || acc.verb,
      types: curr.types || acc.types,
      note_plain: curr.note_plain || acc.note_plain,
      note_ref: curr.note_ref || acc.note_ref,
      afixo: curr.afixo || acc.afixo,
    }),
    {
      hasTargetCanonical: null,
      hasTargetAbundance1: null,
      hasTargetAbundance2: null,
      termination: null,
      termEntrie: null,
      verb: null,
      types: null,
      note_plain: null,
      note_ref: null,
      afixo: null,
    }
  );

  // Retornar o resultado acumulado como array
  return [accumulatedResult];

}

// getPropsOfVerb("acaridar", true, "acaridar").then(test => {
//   console.log(test);
// });