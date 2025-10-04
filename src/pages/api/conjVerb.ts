'use server'

import { NextApiResponse, NextApiRequest } from 'next';
import { loadAllVerbObject } from '../../lib/ssr/jsonLoad';
import { conjugateVerb } from '../../lib/ssr/conjugateVerb';
import { ni } from '../../lib/ssr/normalizeVerb';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // Verifica se o método da requisição é POST
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Método não permitido. Use GET.' });
  }
  try {
    const { verb } = request.query;
    if (!verb || typeof verb !== 'string') {
      return response.status(400).json({ error: 'Entrada inválida: "verb" é obrigatório e deve ser uma string.' });
    }
    const allVerbJson = await loadAllVerbObject();
    if (!allVerbJson) {
      return response.status(500).json({ error: 'Erro ao carregar os dados necessários.' });
    }
    const conjugations = await conjugateVerb(ni(verb) as string, allVerbJson);
    // console.log("conjVerbs deu bom")
    return response.status(200).json(conjugations);
  } catch (error: any) {
    throw error
  }
}
