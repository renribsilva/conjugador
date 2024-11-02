import irreg from '../json/rulesForNoReg.json';

// Função para buscar irregularidades
function innerSearch(obj: object, P: string, M: string, D: string) {
  let hasTarget = false;
  let rule: string | null = null;

  // Função recursiva para buscar dentro do objeto
  function Search(o: any) {
    if (o && typeof o === 'object') {
      if (o[D]) {
        for (const subKey in o[D]) {
          if (o[D][subKey][M]?.includes(P)) {
            hasTarget = true;
            rule = subKey;
            return;
          }
        }
      } else {
        Object.values(o).forEach(Search);
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
  const endings = Object.keys(irreg).sort((a, b) => b.length - a.length);
  const ending = endings.find((end) => verb.endsWith(end));

  if (ending) {
    const verbRules = irreg[ending]?.[verb];

    if (verbRules?.rules) {
      const res = innerSearch(verbRules.rules, P, M, D);

      return {
        ...res,
        ending,
        verb,
        types: verbRules.type,
      };
    }
  }

  return {
    hasTarget: false,
    rule: null,
    P: null,
    M: null,
    ending: null,
    verb: null,
    types: null,
  };
}

// Exemplo de uso
// const res = findIrregRule("amar", "p1", "pr_ind", "VT");
// console.log(res);
