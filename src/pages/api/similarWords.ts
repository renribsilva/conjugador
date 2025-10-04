'use server'

import { NextApiRequest, NextApiResponse } from 'next';
import { processVerb } from '../../lib/ssr/isValidVerbProcess';
import { loadAllVerbObject } from '../../lib/ssr/jsonLoad';
import { getSimilarVerbs } from '../../lib/ssr/getSimilarWords';

export default async function handler(
  request: NextApiRequest, 
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Método não permitido. Use GET.' })
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
    const result = await getSimilarVerbs(verb as string, allVerbJson);
    return response.status(200).json(result);
  } catch (error) {
    throw error
  }
}