// pages/api/conjugations.ts
import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  
  if (request.method !== 'GET') {
    return response.status(200).json(null);
  }

  try {
    const result = await sql`SELECT conjugations FROM json;`;
    if (result.rows.length === 0) {
      return response.status(200).json(null);
    }
    return response.status(200).json(result.rows[0].conjugations);
  } catch (error: any) {
    return response.status(200).json(null);
  }
}
