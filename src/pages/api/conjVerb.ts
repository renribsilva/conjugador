import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  
  if (request.method === 'POST') {
    try {
      const { verb, conjugations } = request.body; 
      if (!verb || !conjugations) return response.status(200).json (null)
      await sql`DELETE FROM json;`;
      await sql`INSERT INTO json (conjugations) VALUES (${JSON.stringify(conjugations.conjugations)});`;
      return response.status(200).json(conjugations.conjugations);
    } catch (error) {
      return response.status(200).json(null);
    }
  } else {
    return response.status(200).json(null);
  }
}
