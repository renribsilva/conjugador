import fs from 'fs/promises';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ni } from '../../lib/normalizeVerb'; // A função ni deve normalizar o verbo

const filePath = path.join(process.cwd(), 'src/json/allVerbs.json');

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') return response.status(405).end();

  const { verb } = request.query;

  // Valida se o verbo é uma string e não um array
  if (Array.isArray(verb) || !verb) return response.status(400).end();

  const normalizedVerb = ni(verb as string); // Normaliza o verbo antes de fazer a busca

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonObject = JSON.parse(data);

    // Normaliza todos os verbos nas chaves do JSON, mas preserva os valores originais
    const normalizedJsonObject = Object.keys(jsonObject).reduce((acc, key) => {
      acc[ni(key)] = jsonObject[key]; // Aqui normalizamos apenas as chaves
      return acc;
    }, {} as Record<string, any>);

    // Verifica se o verbo normalizado está presente no JSON normalizado
    if (normalizedVerb in normalizedJsonObject) {
      // Pega o verbo original (não normalizado)
      const originalVerb = Object.keys(jsonObject).find(key => ni(key) === normalizedVerb);
      const originalValue = jsonObject[originalVerb as string]; // Valor original do verbo

      // Pega a primeira chave e o valor associado ao verbo original
      const firstKey = Object.keys(originalValue)[0];
      const findedVerb = originalValue[firstKey];

      // Retorna o verbo original e o valor associado à primeira chave
      return response.status(200).json({
        result: true,
        findedVerb,
      });
    } else {
      return response.status(200).json({ result: false });
    }
  } catch {
    return response.status(500).end();
  }
}
