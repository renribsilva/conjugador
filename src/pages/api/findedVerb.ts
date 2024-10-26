// pages/api/findVerb.ts
import fs from 'fs/promises';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  
  // Verifica se o método HTTP é GET
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Método não permitido' });
  }

  const { verb } = request.query; // Obtém o verbo da query string

  if (Array.isArray(verb)) {
    return response.status(400).json({ error: 'Verbo deve ser uma string única.' });
  }

  if (verb === undefined) {
    return response.status(400).json({ error: 'Verbo não fornecido.' });
  }

  const filePath = path.join(process.cwd(), 'src/json/allVerbs.json');

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonObject = JSON.parse(data);

    if (verb in jsonObject) {
      return response.status(200).json({ result: jsonObject[verb][0] });
    } else {
      return response.status(404).json({ error: 'Verbo não encontrado por findVerb.' });
    }
  } catch (err) {
    return response.status(500).json({ error: 'Erro ao processar o arquivo JSON por findVerb: ' + err.message });
  }
}
