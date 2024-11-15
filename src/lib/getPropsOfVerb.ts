import { findNoRegRule } from "./findNoRegVerbs";

// Definição da tipagem para os objetos retornados
interface VerbProps {
  hasTarget: boolean | null;
  ending: string | null;
  verb: string | null;
  types: string[] | null;
  abundance: {} | null;
  note: string[] | null;
  afixo: string | null | undefined;
}

function mapTypesToStrings(types) {
  const typeDescriptions = {
    1: "regular",
    2: "irregular",
    3: "defectivo",
    4: "abundante",
    5: "anômalo"
  };

  return types.map(type => typeDescriptions[type] || "tipo desconhecido");
}

function areObjectsEqual(obj1: VerbProps, obj2: VerbProps): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export async function getPropsOfVerb(verb: string, isValidVerb: boolean, validVerb: string): Promise<VerbProps[]> {
 
  const P = ["p1", "p2", "p3", "p4", "p5", "p6"];
  const M = ["gd", "pa", "pr_ind", "pt1_ind", "pt2_ind", "pt3_ind", "ft1_ind", "ft2_ind", 
             "pr_sub", "pt_sub", "fut_sub", "inf", "im1", "im2"];
  const D = ["RAD", "VT", "MT", "NP"];

  const results: VerbProps[] = [];

  for (let p of P) {
    for (let m of M) {
      for (let d of D) {
        const result = findNoRegRule(verb, p, m, d);

        if (result) {
          const mappedTypes = result.types && result.types.length > 0 ? mapTypesToStrings(result.types) : null;
          const abundance = result.abundance && Object.keys(result.abundance).length > 0 ? result.abundance : null;
          const note = result.note && result.note.length > 0 ? result.note : null;

          if (result.ending !== null) {
            if (result.types.includes(1) || result.types.includes(2)) {
              results.push({
                hasTarget: result.hasTarget,
                ending: result.ending,
                verb: validVerb,
                types: mappedTypes,
                abundance: abundance,
                note: note,
                afixo: result.afixo
              });
            }
          } else if (result.types === null && isValidVerb) {
            results.push({
              hasTarget: result.hasTarget,
              ending: result.ending,
              verb: validVerb,
              types: ["regular"],
              abundance: abundance,
              note: note,
              afixo: result.afixo
            });
          }
        }
      }
    }
  }

  // Filtrar os resultados com hasTarget === true
  const filteredTrueResults = results.filter(result => result.hasTarget === true);
  if (filteredTrueResults.length > 0 && filteredTrueResults.every(result => areObjectsEqual(result, filteredTrueResults[0]))) {
    return [filteredTrueResults[0]]; // Retorna o primeiro resultado se todos forem iguais
  }

  // Filtrar os resultados com hasTarget === false
  const filteredFalseResults = results.filter(result => result.hasTarget === false);
  if (filteredFalseResults.length > 0 && filteredFalseResults.every(result => areObjectsEqual(result, filteredFalseResults[0]))) {
    return [filteredFalseResults[0]]; // Retorna o primeiro resultado se todos forem iguais
  }

  // Caso contrário, retorna os resultados filtrados
  return [...filteredTrueResults, ...filteredFalseResults];
}


// Testando a função
// const test = async () => {
//   const resultado = await getPropsOfVerb("abraçar", true, "abraçar");
//   console.log(resultado); // Exibe o resultado ou null se não encontrar
// };
// test();