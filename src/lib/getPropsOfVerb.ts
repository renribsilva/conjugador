import { findNoRegRule } from "./findNoRegVerbs";

interface VerbProps {
  hasTarget: boolean | null;
  ending: string | null;
  verb: string | null;
  types: string[] | null;
  abundance: {} | null;
  note_plain: [] | null;
  note_ref: {} | null;
  afixo: string | null | undefined;
}

// Função para mapear tipos para strings
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

// Função para verificar se dois objetos são iguais
function areObjectsEqual(obj1: VerbProps, obj2: VerbProps): boolean {
  return (
    obj1.hasTarget === obj2.hasTarget &&
    obj1.ending === obj2.ending &&
    obj1.verb === obj2.verb &&
    JSON.stringify(obj1.types) === JSON.stringify(obj2.types) &&
    JSON.stringify(obj1.abundance) === JSON.stringify(obj2.abundance) &&
    JSON.stringify(obj1.note_plain) === JSON.stringify(obj2.note_plain) &&
    JSON.stringify(obj1.note_ref) === JSON.stringify(obj2.note_ref) &&
    obj1.afixo === obj2.afixo
  );
}

// Função principal para buscar propriedades do verbo
export async function getPropsOfVerb(verb: string, isValidVerb: boolean, validVerb: string): Promise<VerbProps[]> {
  const P = ["p1", "p2", "p3", "p4", "p5", "p6"];
  const M = ["gd", "pa", "pr_ind", "pt1_ind", "pt2_ind", "pt3_ind", "ft1_ind", "ft2_ind", 
             "pr_sub", "pt_sub", "fut_sub", "inf", "im1", "im2"];
  const D = ["RAD", "VT", "MT", "NP"];

  const validTypes = [1, 2]; // Tipos válidos

  const resultsMap = new Map<string, VerbProps>(); // Usar um mapa para evitar duplicatas por chave única

  // Iterando sobre as combinações P, M, D
  for (let p of P) {
    for (let m of M) {
      for (let d of D) {
        const result = findNoRegRule(verb, p, m, d);
        if (result) {
          const mappedTypes = result.types?.length ? mapTypesToStrings(result.types) : null;
          const abundance = result.abundance && Object.keys(result.abundance).length > 0 ? result.abundance : null;
          const note_plain = result.note_plain && result.note_plain.length > 0 ? result.note_plain : null;
          const note_ref = result.note_ref && Object.keys(result.note_ref).length > 0 ? result.note_ref : null;

          if (result.ending !== null) {
            if (result.types.some(type => validTypes.includes(type))) {
              const verbProps: VerbProps = {
                hasTarget: result.hasTarget,
                ending: result.ending,
                verb: validVerb,
                types: mappedTypes,
                abundance,
                note_plain,
                note_ref,
                afixo: result.afixo
              };
              const key = `${validVerb}-${result.ending}-${result.afixo}`;
              if (!resultsMap.has(key)) {
                resultsMap.set(key, verbProps);
              }
            }
          } else if (result.types === null && isValidVerb) {
            const verbProps: VerbProps = {
              hasTarget: result.hasTarget,
              ending: result.ending,
              verb: validVerb,
              types: ["regular"],
              abundance,
              note_plain,
              note_ref,
              afixo: result.afixo
            };
            const key = `${validVerb}-regular-${result.afixo}`;
            if (!resultsMap.has(key)) {
              resultsMap.set(key, verbProps);
            }
          }
        }
      }
    }
  }

  // Converte os resultados do Map para um array
  const uniqueResults = Array.from(resultsMap.values());

  // Filtragem de objetos com `hasTarget === true`
  const filteredTrueResults = uniqueResults.filter(result => result.hasTarget === true);

  // Filtragem de objetos com `hasTarget === false`
  const filteredFalseResults = uniqueResults.filter(result => result.hasTarget === false);

  // Se todos os resultados com hasTarget === true são iguais, retorne o primeiro
  if (filteredTrueResults.length > 0 && filteredTrueResults.every(result => areObjectsEqual(result, filteredTrueResults[0]))) {
    return [filteredTrueResults[0]];
  }

  // Se todos os resultados com hasTarget === false são iguais, retorne o primeiro
  if (filteredFalseResults.length > 0 && filteredFalseResults.every(result => areObjectsEqual(result, filteredFalseResults[0]))) {
    return [filteredFalseResults[0]];
  }

  // Retorne todos os resultados filtrados
  return [...filteredTrueResults, ...filteredFalseResults];
}
