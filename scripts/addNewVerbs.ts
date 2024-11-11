import path from 'path';
import readTxtLines from './readTxtLines';

const assetsDir = path.join(process.cwd(), 'assets');

// Função para ler verbos e adicionar os do arquivo 'newVerbs.txt'
export default async function addNewVerbs(words: string[]): Promise<string[]> {
  try {
    const newWordPath = path.join(assetsDir, 'newVerbs.txt');
    const additionalWords = await readTxtLines(newWordPath);
    return [...words, ...additionalWords];
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('Arquivo newVerbs.txt não encontrado.');
    } else {
      throw err;
    }
    return words;
  }
}