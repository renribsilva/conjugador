import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    try {
      const { verb, conjugations } = request.body; // Obtém verbo e conjugações do corpo da requisição

      if (!verb || !conjugations) throw new Error('Verb and conjugations are required');

      // Deleta todas as entradas anteriores da tabela json
      await sql`DELETE FROM json;`;

      // Insere as novas conjugações na tabela JSON
      await sql`INSERT INTO json (conjugations) VALUES (${JSON.stringify(conjugations)});`;

      return response.status(200).json({ message: 'Conjugations saved successfully!' });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  } else {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }
}
