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

/**
 * Retorna um peso extra caso a primeira metade da palavra seja semelhante à outra palavra.
 */
function halfMatchWeight(a: string, b: string): number {
  const halfA = a.slice(0, Math.ceil(a.length / 2));
  const halfB = b.slice(0, Math.ceil(b.length / 2));
  
  const maxHalfLength = Math.max(halfA.length, halfB.length);
  const halfLevenshteinScore = 1 - levenshtein(halfA, halfB) / maxHalfLength;

  return halfLevenshteinScore * 0.4; // Peso extra de até 30%
}

function combinedSimilarity(a: string, b: string): number {
  const maxLevenshtein = Math.max(a.length, b.length);
  const levenshteinScore = 1 - levenshtein(a, b) / maxLevenshtein;
  const substringScore = substringSimilarity(a, b);
  const halfWeight = halfMatchWeight(a, b);

  return (levenshteinScore * 0.4) + (substringScore * 0.6) + halfWeight;
}

export default function getSimilarVerbs(verb: string): string[] {
  const normalizedVerb = ni(verb);
  const similarVerbs: { value: string; score: number }[] = [];

  for (const key in data) {
    const values = data[key];
    const normalizedKey = ni(key);

    if (normalizedKey !== normalizedVerb) {
      const similarityScore = combinedSimilarity(normalizedVerb, normalizedKey);
      similarVerbs.push({ value: values.verb[0], score: similarityScore });
    }
  }

  similarVerbs.sort((a, b) => b.score - a.score);

  const uniqueVerbs = Array.from(new Set(similarVerbs.map(v => v.value)));

  return uniqueVerbs.slice(0, 5);
}

// Exemplo de uso
const word = "crido";
const result = getSimilarVerbs(word);
console.log(result);
