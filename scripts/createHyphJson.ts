import { nw } from "../src/lib/normalizeVerb";
import hyphPtBr from "../src/json/hyph_pt_BR.json"

// Esquema de Liang para associar pesos às divisões
const liangWeight = {
  '9': 5,
  '7': 4,
  '5': 3,
  '3': 2,
  '1': 1,
  '0': 0,
  '2': -1,
  '4': -2,
  '6': -3,
  '8': -4
};

// Função para aplicar as divisões silábicas e os pesos
function applyLiangRules(input: string, entries: string[]): Record<string, Record<string, string>> {
  const normalizedInput = nw(input);

  // Função para numerar a posição de cada caractere no input
  function numberStringPositions(input: string): string {
    return input
      .split('')
      .map((char, index) => `${char}${index}`) // Mapeia cada caractere com a posição
      .join('');
  }

  let positionedInput = numberStringPositions(normalizedInput); // Exemplo: "s0i1l2á3b4i5c6a7s8"
  const result: Record<string, Record<string, string>> = {};

  // Para cada caractere posicionado, verifica as possíveis divisões
  for (let i = 0; i < normalizedInput.length; i++) {
    const letter = positionedInput[i * 2]; // A letra atual
    const number = positionedInput[i * 2 + 1]; // O número de posição da letra
    const numberInt = parseInt(number, 10); // Converte para inteiro
    const key = `${letter}${numberInt}`;

    // Inicializa o resultado para a chave (caso não exista)
    if (!result[key]) {
      result[key] = {};
    }

    // Filtra as entradas que contêm a letra e aplica o algoritmo de Liang
    entries
      .filter(entry => entry.includes(letter))
      .forEach(entry => {
        // Remover números e ponto da entrada
        const formattedEntry = entry
          .replace(/[0-9]/g, '')
          .replace('.', '')
          .split('')
          .map((char, index) => {
            if (char === letter) {
              return `${char}${numberInt}`; // Adiciona o número da posição
            }
            const letterPosition = entry.replace(/[0-9]/g, '').indexOf(letter);
            if (index > letterPosition) {
              return `${char}${numberInt + (index - letterPosition)}`;
            }
            if (index < letterPosition) {
              return `${char}${numberInt - (letterPosition - index)}`;
            }
            return `${char}${numberInt}`; // Ajusta os números conforme as divisões
          })
          .join('');

        // Adiciona as divisões de sílaba ao resultado, com o peso correto
        const weight = liangWeight[entry.replace(/[^\d]/g, '')] || 0;
        if (positionedInput.includes(formattedEntry)) {
          result[key][formattedEntry] = entry; // Mapeia a entrada original
        }
      });
  }

  return result;
}

const input = "silábicas";
const numberedResult = applyLiangRules(input, hyphPtBr);
console.log(numberedResult);
