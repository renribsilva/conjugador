import irreg from '../json/rulesForIrreg.json';

// Função para buscar irregularidades
function innerSearch(obj: object, P: string, M: string, D: string) {
  let hasTarget = false;
  let rule: string | null = null;

  // Função recursiva para buscar dentro do objeto
  function Search(o: object) {
    if (typeof o === 'object' && o !== null) {
      for (const key in o) {
        if (key === D) {
          for (const subKey in o[key]) {
            if (o[key][subKey][M]?.includes(P)) {
              hasTarget = true;
              rule = subKey;
              return;
            }
          }
        } else {
          Search(o[key]);
        }
      }
    }
  }

  Search(obj);

  return {
    hasTarget,
    rule,
    P,
    M
  };
}

// Função para encontrar a terminação do verbo e buscar irregularidades
export function findIrregRule(verb: string, P: string, M: string, D: string) {
  const endings = Object.keys(irreg);

  endings.sort((a, b) => b.length - a.length);

  const ending = endings.find((end) => verb.endsWith(end));

  if (ending) {
    // Verifica se a terminação e o verbo existem no objeto irreg
    const verbRules = irreg[ending]?.[verb];
    
    if (verbRules && verbRules.rules) {
      const selectedObject = verbRules.rules;
      const res = innerSearch(selectedObject, P, M, D);

      return {
        hasTarget: res.hasTarget,
        ending,
        verb,
        targetP: res.P,
        targetM: res.M,
        rule: res.rule,
      };
    }
  }

  return {
    hasTarget: false,
    rule: null,
    ending: null,
    P,
    M
  };
}

// Exemplo de uso
// const res = findIrregRule("saber", "p1", "pr_ind", "RAD");
// console.log(res);
