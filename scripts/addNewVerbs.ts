import path from 'path';
import readTxtLines from './readTxtLines';
import { nw } from '../src/lib/normalizeVerb';

const listsDir = path.join(process.cwd(), 'lists');

export default async function addNewVerbs(words: string[]): Promise<string[]> {
  try {

    const newWordPath = path.join(listsDir, 'newVerbs.txt');
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