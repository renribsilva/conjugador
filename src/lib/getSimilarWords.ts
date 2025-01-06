import jsonData from "../json/allVerbs.json";
import { AllVerbsEntry } from "../types";
import { ni } from "./normalizeVerb";

const data: AllVerbsEntry = jsonData;

function levenshtein(a: string, b: string): number {
  const tmp: number[][] = [];
  const alen = a.length, blen = b.length;

  if (alen === 0) return blen;
  if (blen === 0) return alen;

  for (let i = 0; i <= alen; i++) tmp[i] = [i];
  for (let j = 0; j <= blen; j++) tmp[0][j] = j;

  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      tmp[i][j] = Math.min(tmp[i - 1][j] + 1, tmp[i][j - 1] + 1, tmp[i - 1][j - 1] + cost);
    }
  }

  return tmp[alen][blen];
}

function substringSimilarity(a: string, b: string): number {
  const common = a.split("").filter(char => b.includes(char)).length;
  const maxLength = Math.max(a.length, b.length);
  return common / maxLength;
}

function combinedSimilarity(a: string, b: string): number {
  const maxLevenshtein = Math.max(a.length, b.length);
  const levenshteinScore = 1 - levenshtein(a, b) / maxLevenshtein;
  const substringScore = substringSimilarity(a, b);
  return (levenshteinScore * 0.4) + (substringScore * 0.6);
}

export default function getSimilarVerbs(verb: string): string[] {
  const similarVerbs: { key: string; score: number }[] = [];

  for (const [key, values] of Object.entries(data)) {
    for (const value of values.verb) {
      if (value !== verb) {
        const similarityScore = combinedSimilarity(ni(verb), ni(value));
        if (similarityScore > 0.5) {
          similarVerbs.push({ key, score: similarityScore });
        }
      }
    }
  }

  similarVerbs.sort((a, b) => b.score - a.score);

  if (similarVerbs.length === 0) return [];

  const mostSimilar = similarVerbs[0];
  const remainingVerbs = similarVerbs.slice(1);

  const shuffled = remainingVerbs.sort(() => Math.random() - 0.5);
  const finalSelection = [mostSimilar, ...shuffled.slice(0, 4)];

  return finalSelection.map(({ key }) => key);
}

// Exemplo de uso
// const word = "EXTAR";
// const result = getSimilarVerbs(word);
// console.log(result);
