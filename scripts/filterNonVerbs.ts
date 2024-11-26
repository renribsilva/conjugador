import { nw } from '../src/lib/normalizeVerb';
import path from 'path';
import readTxtLines from './readTxtLines';

const assetsDir = path.join(process.cwd(), 'assets');

export async function filterNonVerbs(allVerbs: string[], fileName: string): Promise<string[]> {

  const filePath = path.join(assetsDir, fileName);
  const nonVerbs = await readTxtLines(filePath);
  const normNonVerbs = nonVerbs.map(verb => nw(verb)).filter(Boolean);
  
  return allVerbs.filter(verb => !normNonVerbs.includes(nw(verb)));
  
}
