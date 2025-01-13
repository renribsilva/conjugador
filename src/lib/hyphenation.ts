import { nw } from './normalizeVerb';

function searchEntriesByLetter(input: string, entries: string[]): Record<string, Record<string, string>> {

  const normalizedInput = nw(input);

  // Função para numerar a posição de cada caractere no input
  function numberStringPositions(input: string): string {
    return input
      .split('')
      .map((char, index) => `${char}${index}`) // Mapeia cada caractere com a posição
      .join('');
  }

  let positionedInput = numberStringPositions(normalizedInput); // Exemplo: "i1r2"
  const result: Record<string, Record<string, string>> = {};

  for (let i = 0; i < normalizedInput.length; i++) {

    const letter = positionedInput[i * 2]; 
    const number = positionedInput[i * 2 + 1]; 
    const numberInt = parseInt(number, 10);
    const key = `${letter}${numberInt}`;

    // Inicializa o resultado para a chave (caso não exista)
    if (!result[key]) {
      result[key] = {};
    }

    entries
      .filter(entry => entry.includes(letter))
      .forEach(entry => {
        const formattedEntry = entry
          .replace(/[0-9]/g, '') 
          .replace('.', '')
          .split('') 
          .map((char, index) => {
            if (char === letter) {
              return`${char}${numberInt}`
            }
            return`${char}`
          })
          .join('')

        result[key][formattedEntry] = entry;

        // Verifica se a entrada formatada corresponde ao input posicionado
        if (positionedInput.includes(formattedEntry)) {
          result[key][formattedEntry] = entry; // mapeia a entrada original
        }
      });
  }

  return result;
}


function transformString(input: string): string {
  const numberString = input.match(/\d+/)?.[0]; // Obtém o primeiro número encontrado
  console.log('Number String:', numberString);
  
  if (!numberString) return '';  // Caso não haja número, retorna uma string vazia
  
  const numberIndex = input.indexOf(numberString); // Encontra o índice do número na string
  console.log('Number Index:', numberIndex);

  const numberInt = parseInt(numberString); // Converte o número para inteiro
  let result = '';

  // Para os caracteres à esquerda do número (números negativos)
  for (let i = numberIndex - 1; i >= 0; i--) {
    const char = input[i];
    result = `${char}${numberInt - (numberIndex - i)}` + result; // Decrementa corretamente
  }

  console.log('Left Part:', result);

  // Coloca o número original no centro (não altera)
  result += `${input[numberIndex]}`;

  // Para os caracteres à direita do número (números positivos)
  for (let i = numberIndex + numberString.length; i < input.length; i++) {
    const char = input[i];
    result += `${char}${numberInt + (i - numberIndex)}`; // Incrementa corretamente
  }

  console.log('Right Part:', result);

  return result;
}

const input = "a3a";
const transformedResult = transformString(input);
console.log(transformedResult);  // Agora deve retornar "a3a4"


// const input = "ir";
// const numberedResult = searchEntriesByLetter(input, hyphPtBr);
// console.log(numberedResult);


