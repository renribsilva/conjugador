// pages/api/conjugations.ts
import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const result = await sql`SELECT conjugations FROM json;`;

    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'Nenhum dado encontrado' });
    }

    return response.status(200).json(result.rows[0].conjugations);
  } catch (error: any) {
    console.error('Erro ao buscar conjugações:', error);
    return response.status(500).json({ error: 'Erro interno no servidor' });
  }
}
