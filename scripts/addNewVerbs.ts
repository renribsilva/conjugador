import path from 'path';
import readTxtLines from './readTxtLines';
import { nw } from '../src/lib/normalizeVerb';

const listsDir = path.join(process.cwd(), 'lists');

export default async function addNewVerbs(words: string[]): Promise<string[]> {
  
  try {

    const newWordPath = path.join(listsDir, 'newVerbs.txt');
    const newWords = await readTxtLines(newWordPath);
    const normNewWords = newWords.map(verb => nw(verb)).filter(verb => verb !== '');
    const existingWordsSet = new Set(words.map(verb => nw(verb)));
    const filteredNewWords = normNewWords.filter(verb => !existingWordsSet.has(verb));
    const notAddedWords = normNewWords.filter(verb => existingWordsSet.has(verb));

    console.log('- verbos que NÃO serão adicionados:', notAddedWords);
    console.log(`- quantidade de novos verbos a serem adicionados: ${newWords.filter(Boolean).length}`);

    return [...words, ...filteredNewWords];
    
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('Arquivo newVerbs.txt não encontrado.');
    } else {
      throw err;
    }
    return words;
  }
}
