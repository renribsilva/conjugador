import fs from 'fs';
import { nw } from '../src/lib/normalizeVerb';

// Função que verifica se uma palavra contém diacríticos
function hasDiacritics(text: string): boolean {
  const diacriticRegex = /[\u00C0-\u00FF\u0100-\u017F]/;
  return diacriticRegex.test(text);
}

// Função para filtrar as linhas de um arquivo .txt que contêm diacríticos
function filterLinesWithDiacritics(filePath: string, outputFilePath: string): void {
  // Lê o arquivo de texto
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Separa o conteúdo em linhas
  const lines = fileContent.split('\n').map((word) => nw(word.trim().replace(/\/.*/, '')));

  const exceptions = new Set(["dar", "ir", "ler", "pôr", "rer", "rir", "ser", "ter", "ver", "vir"]);
    const verbs = lines.filter(word =>
      /(ar|er|ir|por|pôr)$/.test(word) &&
      !/'/.test(word) &&
      !/ç/.test(nw(word)) &&
      (word.length > 3 || exceptions.has(word))
    );
  
  // Filtra as linhas que contêm diacríticos
  const filteredLines = verbs.filter(line => hasDiacritics(line));
  
  // Escreve as linhas filtradas em um novo arquivo
  fs.writeFileSync(outputFilePath, filteredLines.join('\n'), 'utf-8');
  
  console.log(`Linhas com diacríticos foram salvas em: ${outputFilePath}`);
}

// Exemplo de uso
const filePath = './public/words.txt';  // Caminho do arquivo de entrada
const outputFilePath = './assets/output.txt';  // Caminho do arquivo de saída
filterLinesWithDiacritics(filePath, outputFilePath);
