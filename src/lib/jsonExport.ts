import fs from 'fs/promises';
import path from 'path';

const allVerbsPath = path.join(process.cwd(), 'src/json/allVerbs.json');
const RegPath = path.join(process.cwd(), 'src/json/rulesForReg.json');

export const allVerbsData = fs.readFile(allVerbsPath, 'utf-8');
export const regData = fs.readFile(RegPath, 'utf-8');