import fs from 'fs';
import { nw } from '../../src/lib/ssr/normalizeVerb';

export default async function readTxtLines(filePath: string): Promise<string[]> {

  const data = await fs.promises.readFile(filePath, 'utf-8');
  return data
    .split('\n')
    .map((word) => nw(word.trim().replace(/\/.*/, '')))
    .filter(Boolean);
}