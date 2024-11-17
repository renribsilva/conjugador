import path from 'path';
import readTxtLines from './readTxtLines';
import { nw } from '../src/lib/normalizeVerb';

const assetsDir = path.join(process.cwd(), 'assets');

export default async function addNewVerbs(words: string[]): Promise<string[]> {
  try {

    const newWordPath = path.join(assetsDir, 'newVerbs.txt');
    const newWords = await readTxtLines(newWordPath);
    const normnewWords = newWords.map(verb => nw(verb));
    return [...words, ...normnewWords];

  } catch (err) {

    if (err.code === 'ENOENT') {

      console.warn('Arquivo newVerbs.txt não encontrado.');

    } else {

      throw err;

    }

    return words;
  }
}