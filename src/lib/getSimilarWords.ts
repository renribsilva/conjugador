import jsonData from "../json/allVerbs.json";

type VerbsData = {
  [key: string]: string[];
};

const data: VerbsData = jsonData;

// Calcula a distância Levenshtein entre duas strings
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

// Similaridade baseada em substrings comuns
function substringSimilarity(a: string, b: string): number {
  const common = a.split("").filter(char => b.includes(char)).length;
  const maxLength = Math.max(a.length, b.length);
  return common / maxLength;
}

// Combina Levenshtein e substring similarity
function combinedSimilarity(a: string, b: string): number {
  const maxLevenshtein = Math.max(a.length, b.length); // Normaliza para 0-1
  const levenshteinScore = 1 - levenshtein(a, b) / maxLevenshtein;
  const substringScore = substringSimilarity(a, b);
  return (levenshteinScore * 0.4) + (substringScore * 0.6); // Pesos ajustáveis
}

// Função para obter verbos similares
export default function getSimilarVerbs(verb: string): string[] {
  const similarVerbs: { key: string; score: number }[] = [];

  // Itera sobre as chaves do objeto e os arrays
  for (const [key, values] of Object.entries(data)) {
    for (const value of values) {
      if (value !== verb) { // Ignora o próprio verbo
        const similarityScore = combinedSimilarity(verb, value);
        if (similarityScore > 0.5) { // Limite ajustável
          similarVerbs.push({ key: value, score: similarityScore });
        }
      }
    }
  }

  // Ordena por pontuação de similaridade em ordem decrescente e retorna os top 5
  return similarVerbs
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ key }) => key);
}

// Exemplo de uso
const word = "";
const result = getSimilarVerbs(word);
console.log(result);
