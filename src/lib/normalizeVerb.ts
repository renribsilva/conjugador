export function ni(input: string): string {
  return input
    .normalize("NFD") // Normaliza a string para decompor caracteres especiais
    .toLowerCase() // Converte para minúsculas
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos e diacríticos
    .replace(/--+/g, "-") // Substitui múltiplos hífens por um único
    .replace(/\s+/g, "") // Substitui espaços por nada
    .trim(); // Remove espaços em branco extras
}

export const nw = (word: string | any): string => {
  // Verifica se word é uma string
  if (typeof word !== 'string') {
    console.error('Erro: nw failed -> word não é uma string:', word);
    return ''; // Retorna uma string vazia ou outro valor padrão
  }

  return word
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();
};

