export function ni(input: string): string {
  
  const normalizedInput = input.normalize("NFD");

  if (typeof normalizedInput !== 'string') {
    console.error('Erro: nw failed -> word não é uma string:', normalizedInput);
    return '';
  }

  const cleaned = normalizedInput.replace(/[\u0300-\u036f]/g, (match) => {
    if (match === "\u0327") {
      return match;
    }
    return "";
  });

  return cleaned
    .toLowerCase() 
    .replace(/--+/g, "-") 
    .replace(/\s+/g, "") 
    .trim()
    .normalize('NFC');
}

export const nw = (word: string | any): string => {
  
  if (typeof word !== 'string') {
    console.error('Erro: nw failed -> word não é uma string:', word);
    return '';
  }

  return word
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim()
    .normalize('NFC');
};

// console.log(ni("pôr"));      
// console.log(ni("ç"));        
// console.log(ni("àç"));      
// console.log(ni("começar"));  
// console.log(ni("café"));     
// console.log(ni("ação"));     
// console.log(ni("co-habitar"));     

