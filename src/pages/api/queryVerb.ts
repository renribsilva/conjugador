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
    // Realiza a consulta à tabela 'json' para obter o objeto da coluna 'conjugations'
    const result = await sql`SELECT conjugations FROM json;`;

    // Verifica se o resultado contém linhas
    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'Nenhum dado encontrado' });
    }

    // Mostra o objeto no console
    // console.log(result.rows[0].conjugations);

    // Retorna o objeto da coluna 'conjugations' como JSON
    return response.status(200).json(result.rows[0].conjugations);
  } catch (error: any) {
    console.error('Erro ao buscar conjugações:', error);
    // Retorna um erro caso ocorra algum problema
    return response.status(500).json({ error: 'Erro interno no servidor' });
  }
}
