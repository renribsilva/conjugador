import fs from 'fs';
import path from 'path';

// Função para adicionar novos verbos de um arquivo
export function addNewVerbs(words: string[]): Promise<string[]> {
  const newWordPath = path.join(process.cwd(), 'public', 'novosVerbos.txt');

  return new Promise((resolve, reject) => {
    // Verifica se o arquivo 'novosVerbos.txt' existe
    fs.readFile(newWordPath, 'utf-8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.warn('Arquivo novosVerbos.txt não encontrado. Nenhuma palavra adicional foi adicionada.');
          return resolve(words);
        }
        return reject(err);
      }

      // Adiciona cada palavra ao array original, filtrando palavras vazias
      const additionalWords = data.split('\n').map((word) => word.trim()).filter(Boolean);
      words.push(...additionalWords);
      resolve(words);
    });
  });
}

// Define o tipo para o objeto de verbos
interface Verbos {
  [key: string]: string[];
}

// Função para ler um arquivo e retornar seu conteúdo como um array de palavras
async function readWordsFromFile(filePath: string): Promise<string[]> {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return data.split('\n').map(word => word.trim()).filter(Boolean);
}

// Função para ler o JSON e retornar como um objeto
async function readJsonFile(filePath: string): Promise<Verbos> {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  try {
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Erro ao analisar o JSON em ${filePath}: ${error.message}`);
  }
}

// Função para comparar os verbos irregulares com os verbos normais
export async function findMissingIrregularVerbs(): Promise<string[]> {
  const irregularFilePath = path.join(process.cwd(), 'public', 'verbosIrregulares.txt');
  const verbsJsonPath = path.join(process.cwd(), 'src', 'json', 'verbos.json');

  try {
    const irregularVerbs = await readWordsFromFile(irregularFilePath);
    const verbsJson = await readJsonFile(verbsJsonPath);
    const verbKeys = Object.keys(verbsJson);
    const missingVerbs = irregularVerbs.filter(verb => !verbKeys.includes(verb));

    return missingVerbs;

  } catch (error) {
    console.error('Erro ao encontrar verbos irregulares:', error);
    throw error; // Lança o erro para que o chamador possa tratá-lo
  }
}

