import { findNoRegRule } from "./findNoRegVerbs";
import { ni } from "./normalizeVerb";

// Definição da tipagem para os objetos retornados
interface VerbProps {
  hasTarget: string | null;
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

// Corrige a função findPropsOfVerb para armazenar apenas os resultados com hasTarget true em um único objeto
export async function findPropsOfVerb(verb: string, isValidVerb: boolean, validVerb: string): Promise<VerbProps | null> {
  const P = ["p1", "p2", "p3", "p4", "p5", "p6"];
  const M = ["gd", "pa", "pr_ind", "pt1_ind", "pt2_ind", "pt3_ind", "ft1_ind", "ft2_ind", 
             "pr_sub", "pt_sub", "fut_sub", "inf", "im1", "im2"];
  const D = ["RAD", "VT", "MT", "NP"];

  const normalizedVerb = ni(verb)

  for (let p of P) {
    for (let m of M) {
      for (let d of D) {

        const result = await findNoRegRule(normalizedVerb, p, m, d);
        const mappedTypes = result.types ? mapTypesToStrings(result.types) : null;
        const abundance = result.abundance && typeof result.abundance === 'object' && Object.keys(result.abundance).length === 0 ? null : result.abundance;
        const note = result.note && result.note.length === 0 ? null : result.note;

        if (result) {
          
          if (result.ending !== null && result.types.includes(1)) {
            const A: VerbProps = {
              hasTarget: `Oba, o verbo '${validVerb}' foi encontrado em nossa base de dados. Ele será conjugado como verbo regular`,
              ending: result.ending,
              verb: validVerb,
              types: mappedTypes,
              abundance: abundance,
              note: note,
              afixo: result.afixo
            };
            // console.log(A);
            return A;
          } 
          
          else if (result.ending !== null && result.types.includes(2)) { 
            const B: VerbProps = {
              hasTarget: `Oba! O verbo '${validVerb}' foi encontrado em nossa base de dados. Ele será conjugado como verbo irregular`,
              ending: result.ending,
              verb: validVerb,
              types: mappedTypes,
              abundance: abundance,
              note: note,
              afixo: result.afixo
            };
            // console.log(B);
            return B;
          }

          else if (result.ending === null && result.types === null && isValidVerb) { 
            const C: VerbProps = {
              hasTarget: `Oba! O verbo '${validVerb}' foi encontrado em nossa base de dados. Ele será conjugado como verbo regular`,
              ending: result.ending,
              verb: validVerb,
              types: [ "regular" ],
              abundance: abundance,
              note: note,
              afixo: result.afixo
            };
            // console.log(B);
            return C;
          }
        }
      }
    }
  }

  // Caso não encontre nenhum resultado
  return {
    hasTarget: `Que pena! Não encontramos '${verb}' na nossa lista de verbos válidos.`,
    ending: null,
    verb: null,
    types: null,
    abundance: null,
    note: null,
    afixo: null
  };
}

// Testando a função
// const test = async () => {
//   const resultado = await findPropsOfVerb("acabar", true, "acabar");
//   console.log(resultado); // Exibe o resultado ou null se não encontrar
// };
// test();
