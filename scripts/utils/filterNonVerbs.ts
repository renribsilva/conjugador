import path from 'path';
import readTxtLines from './readTxtLines';
import { nw } from '../../src/lib/ssr/normalizeVerb';

const listsDir = path.join(process.cwd(), 'lists');

export async function filterNonVerbs(allVerbs: string[], fileName: string): Promise<string[]> {

  const filePath = path.join(listsDir, fileName);
  const nonVerbs = await readTxtLines(filePath);
  const normNonVerbs = nonVerbs.map(verb => nw(verb)).filter(Boolean);
  
  return allVerbs.filter(verb => !normNonVerbs.includes(nw(verb)));
  
}
