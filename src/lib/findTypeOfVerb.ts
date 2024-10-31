import irreg from '../json/rulesForNoReg.json';

// Função para encontrar o tipo de irregularidade apenas com base no verbo
export function findTypeOfVerb(verb: string): string {
  const endings = Object.keys(irreg).sort((a, b) => b.length - a.length);
  const ending = endings.find((end) => verb.endsWith(end));

  if (ending) {
    
    const verbRules = irreg[ending]?.[verb];

    if (verbRules?.type) {
      const typeDescriptions: { [key: number]: string } = {
        1: 'regular',
        2: 'irregular',
        3: 'defectivo',
        4: 'abundante',
        5: 'anômalo',
      };

      // Converte os tipos em uma string formatada
      const types = Array.isArray(verbRules.type)
        ? verbRules.type.map((type: number) => typeDescriptions[type]).filter(Boolean)
        : [typeDescriptions[verbRules.type]].filter(Boolean);

      // Retorna a string com os tipos formatados
      return types.length ? `${types.join(', ')}` : 'regular'; 
    }
  }

  return 'regular'; // Retorna o tipo padrão se não encontrado
}

// Exemplo de uso
// const type = findTypeOfVerb("amar");
// console.log(type); 
