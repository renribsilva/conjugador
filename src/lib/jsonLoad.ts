import fs from 'fs/promises';
import path from 'path';

let allVerbJson: Record<string, any> | null = null;
let regJson: Record<string, any> | null = null;

const allVerbsPath = path.join(process.cwd(), 'src/json/allVerbs.json');
const regPath = path.join(process.cwd(), 'src/json/rulesByTerm.json');

export async function loadAllVerbObject() {
  if (allVerbJson === null) {
    const data = await fs.readFile(allVerbsPath, 'utf-8');
    allVerbJson = JSON.parse(data);
  }
  return allVerbJson;
}

export async function loadRegObject() {
  if (regJson === null) {
    const data = await fs.readFile(regPath, 'utf-8');
    regJson = JSON.parse(data);
  }
  return regJson;
}