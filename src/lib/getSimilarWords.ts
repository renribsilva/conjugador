import jsonData from '../json/allVerbs.json';

// Tipagem do JSON, onde a chave é uma string e o valor é um array de strings
type VerbsData = {
  [key: string]: string[];
};

// Importando o JSON com a tipagem correta
const data: VerbsData = jsonData;

// Função para calcular a distância de Levenshtein entre duas palavras
function levenshtein(a: string, b: string): number {
  const tmp: number[][] = []; // Explicitamente definindo como array de números
  let i, j, alen = a.length, blen = b.length, res;

  if (alen === 0) return blen;
  if (blen === 0) return alen;

  for (i = 0; i <= alen; i++) tmp[i] = [i];
  for (j = 0; j <= blen; j++) tmp[0][j] = j;

  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      res = a[i - 1] === b[j - 1] ? 0 : 1;
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,  // Deletar
        tmp[i][j - 1] + 1,  // Inserir
        tmp[i - 1][j - 1] + res  // Substituir
      );
    }
  }

  return tmp[alen][blen];
}

// Função que recebe um verbo e retorna um array com verbos semelhantes (máximo de 5)
export default function getSimilarVerbs(verb: string): string[] {
  const similarVerbs: string[] = [];
  let distanceThreshold = 1; // Inicia com distância de Levenshtein 1

  // Percorre todas as chaves no JSON enquanto não encontrar 5 verbos semelhantes
  while (similarVerbs.length < 5 && distanceThreshold <= 5) {
    // Percorre todas as chaves no JSON
    for (let key in data) {
      // Compara o verbo fornecido com as chaves do JSON
      if (key !== verb) {
        // Calculando a distância de Levenshtein
        const levenshteinDistance = levenshtein(verb, key);

        // Se a distância de Levenshtein for menor ou igual ao limite de distância
        if (levenshteinDistance <= distanceThreshold && !similarVerbs.includes(key)) {
          similarVerbs.push(key);
        }
      }
    }

    // Caso não tenha encontrado 5 verbos, aumenta o limite de distância
    if (similarVerbs.length < 5) {
      distanceThreshold++;
    }
  }

  // Retorna um array simples com os verbos semelhantes (máximo de 5)
  return similarVerbs.slice(0, 5);  // Garante que no máximo 5 verbos sejam retornados
}

// Exemplo de uso
// const word = "abraçar";  // Altere conforme necessário
// const result = getSimilarVerbs(word);
// console.log(result);
