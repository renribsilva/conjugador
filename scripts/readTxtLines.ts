import fs from 'fs';
import { nw } from '../src/lib/normalizeVerb';

// Função para ler .txt e retornar seu conteúdo como um array de palavras
export default async function readTxtLines(filePath: string): Promise<string[]> {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return data.split('\n').map((word) => nw(word.replace(/\/.*/, '')));
}