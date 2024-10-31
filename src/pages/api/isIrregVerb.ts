// pages/api/buscarVerbo.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { ni } from '../../lib/normalizeVerb';

const verificarVerboNaLista = (inputValue: string, verbos: string[]): boolean => {
  const normalizedInput = ni(inputValue);
  return verbos.some(verb => ni(verb) === normalizedInput);
};

const verificarVerboNoJSON = (inputValue: string, jsonData: any): boolean => {
  const normalizedInput = ni(inputValue);

  if (Object.keys(jsonData).length === 0) return false;

  for (const primeiraChave of Object.keys(jsonData)) {
    const subObjeto = jsonData[primeiraChave];
    if (subObjeto && typeof subObjeto === 'object') {
      if (subObjeto.hasOwnProperty(normalizedInput)) return true;
    }
  }

  return false;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { inputValue } = req.query;

  if (typeof inputValue !== 'string') {
    return res.status(400).json({ error: 'inputValue deve ser uma string' });
  }

  const filePath = path.join(process.cwd(), 'public', 'verbosIrregulares.txt');
  const jsonFilePath = path.join(process.cwd(), 'src', 'json', 'rulesForNoReg.json');

  try {
    const verbosData = fs.readFileSync(filePath, 'utf8');
    const verbos = verbosData.split('\n');
    const verboEncontradoNaLista = verificarVerboNaLista(inputValue, verbos);

    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    const verboEncontradoNoJSON = verificarVerboNoJSON(inputValue, jsonData);

    const resultadoFinal = verboEncontradoNaLista && !verboEncontradoNoJSON ? false : true;

    return res.status(200).json({
      results: resultadoFinal,
      isIrreg: verboEncontradoNaLista,
      hasRUles: verboEncontradoNoJSON
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao processar as requisições' });
  }
}
