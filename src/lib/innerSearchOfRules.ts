// Função recursiva para buscar terminations
export default function innerSearchOfRules(obj: object, P: string, M: string, D: string) {
  
  let hasTarget = false;
  let rule: string | null = null;

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