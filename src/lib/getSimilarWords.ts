import jsonData from '../json/allVerbs.json';

type VerbsData = {
  [key: string]: string[];
};

const data: VerbsData = jsonData;

function levenshtein(a: string, b: string): number {
  const tmp: number[][] = [];
  let i, j, alen = a.length, blen = b.length, res;

  if (alen === 0) return blen;
  if (blen === 0) return alen;

  for (i = 0; i <= alen; i++) tmp[i] = [i];
  for (j = 0; j <= blen; j++) tmp[0][j] = j;

  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      res = a[i - 1] === b[j - 1] ? 0 : 1;
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + res
      );
    }
  }

  return tmp[alen][blen];
}

export default function getSimilarVerbs(verb: string): string[] {
  const similarVerbs: string[] = [];
  let distanceThreshold = 1;

  while (similarVerbs.length < 5 && distanceThreshold <= 5) {
    for (let key in data) {
      if (key !== verb) {
        const levenshteinDistance = levenshtein(verb, key);
        if (levenshteinDistance <= distanceThreshold && !similarVerbs.includes(key)) {
          similarVerbs.push(key);
        }
      }
    }

    if (similarVerbs.length < 5) {
      distanceThreshold++;
    }
  }

  return similarVerbs.sort(() => Math.random() - 0.5).slice(0, 5);
}

// const word = "abraçar";
// const result = getSimilarVerbs(word);
